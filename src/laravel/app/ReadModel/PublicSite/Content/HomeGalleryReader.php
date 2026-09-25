<?php

namespace App\ReadModel\PublicSite\Content;

use App\Application\PublicSite\GetPublicHomeGalleryQueryResult;
use App\Models\Page;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class HomeGalleryReader
{
    private const LIMIT = 6;

    public function __construct(
        private readonly CaseStudyReader $cases,
        private readonly CreditsReader $credits,
        private readonly FeedReader $feed,
        private readonly ProjectReader $projects,
        private readonly ReferenceCollectionReader $collections,
        private readonly SnippetReader $snippets,
        private readonly TechnologyReader $technologies,
        private readonly TopicReader $topics,
    ) {}

    public function find(string $locale): GetPublicHomeGalleryQueryResult
    {
        $recent = $this->pageResults([
            'writing' => $this->feedPage($locale, 'desc', 'post'),
            'finding' => $this->feedPage($locale, 'desc', 'achado'),
            'collection' => $this->feedPage($locale, 'desc', 'colecao'),
        ]);
        $popularFinding = $this->feedPage($locale, 'popular', 'achado');
        $popular = [
            'items' => [
                'writing' => [],
                'finding' => $popularFinding->getCollection()->all(),
                'collection' => [],
            ],
            'totals' => [
                'writing' => 0,
                'finding' => $popularFinding->total(),
                'collection' => 0,
            ],
        ];
        $collectionsPage = $this->collections->listPaginated(self::LIMIT, 'desc', $locale);
        $portfolio = $this->pageResults([
            'cases' => $this->cases->listPaginated(self::LIMIT, 'desc'),
            'projects' => $this->projects->listPaginated(self::LIMIT, 'desc'),
            'experiments' => $this->projects->listExperimentsPaginated(self::LIMIT, 'desc'),
            'collections' => $collectionsPage,
            'snippets' => $this->snippets->listPaginated(self::LIMIT, 'desc'),
            'technologies' => $this->technologies->listPaginated(self::LIMIT, 'order'),
            'topics' => $this->topics->listPaginated(self::LIMIT, 'alpha'),
            'credits' => $this->credits->listPaginated(self::LIMIT, 'desc'),
        ]);
        $highlights = $this->highlights();

        return new GetPublicHomeGalleryQueryResult(
            highlights: $highlights['items'],
            recent: $recent['items'],
            popular: $popular['items'],
            portfolio: $portfolio['items'],
            collectionShowcases: array_map(
                fn ($collection): array => [
                    'collection' => $collection,
                    'resources' => $this->collections->resourcesForHome($collection, self::LIMIT)->all(),
                ],
                $portfolio['items']['collections'],
            ),
            totals: [
                'highlights' => $highlights['total'],
                'recent' => $recent['totals'],
                'popular' => $popular['totals'],
                'portfolio' => $portfolio['totals'],
                'collection_showcases' => $collectionsPage->total(),
            ],
        );
    }

    private function pageResults(array $pages): array
    {
        $items = [];
        $totals = [];

        foreach ($pages as $key => $page) {
            $items[$key] = $page->getCollection()->all();
            $totals[$key] = $page->total();
        }

        return ['items' => $items, 'totals' => $totals];
    }

    private function feedPage(string $locale, string $sort, string $kind): LengthAwarePaginator
    {
        return $this->feed->listPaginated(
            self::LIMIT,
            1,
            $sort,
            $kind,
            $locale,
            null,
            null,
            null,
        );
    }

    private function highlights(): array
    {
        $revision = Page::query()
            ->where('slug', 'portfolio')
            ->where(fn ($visibility) => $visibility
                ->where('pages.hidden', false)
                ->orWhereNull('pages.hidden'))
            ->whereHas('currentRevision', static function ($query): void {
                $query->where(fn ($visibility) => $visibility
                    ->where('hidden', false)
                    ->orWhereNull('hidden'));
            })
            ->with([
                'currentRevision.featuredCases' => static fn ($query) => $query
                    ->where('hidden', false)
                    ->where('nda', false)
                    ->with(['translations', 'technologies.translations']),
                'currentRevision.featuredProjects' => static fn ($query) => $query
                    ->where('hidden', false)
                    ->where('nda', false)
                    ->with(['translations', 'technologies.translations']),
                'currentRevision.featuredWritings' => static fn ($query) => $query
                    ->where('hidden', false)
                    ->with(['translations', 'topics.translations']),
            ])
            ->first()?->currentRevision;

        if ($revision === null) {
            return ['items' => [], 'total' => 0];
        }

        $items = collect()
            ->concat(collect($revision->featuredCases)->map(static fn ($item): array => ['kind' => 'cases', 'item' => $item]))
            ->concat(collect($revision->featuredProjects)->map(static fn ($item): array => ['kind' => 'projects', 'item' => $item]))
            ->concat(collect($revision->featuredWritings)->map(static fn ($item): array => ['kind' => 'writing', 'item' => $item]))
            ->values();

        return ['items' => $items->take(self::LIMIT)->all(), 'total' => $items->count()];
    }
}
