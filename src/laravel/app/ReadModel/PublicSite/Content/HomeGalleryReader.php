<?php

namespace App\ReadModel\PublicSite\Content;

use App\Application\PublicSite\GetPublicHomeGalleryQueryResult;
use App\Content\HomeGallerySection;
use App\Models\Page;
use App\Models\PageRevision;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class HomeGalleryReader
{
    private const LIMIT = 6;

    private const FINDING_LIMIT = 3;

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
        $homeRevision = $this->homeRevision();
        $portfolioRevision = $this->portfolioRevision();
        $sectionStates = $homeRevision?->homeSections
            ->mapWithKeys(fn ($section): array => [$section->section_key => $section->enabled])
            ->all() ?? [];

        $recent = $this->pageResults([
            'writing' => $this->sectionEnabled($sectionStates, 'recent-writing')
                ? $this->feedPage($locale, 'desc', 'post')
                : null,
            'finding' => $this->sectionEnabled($sectionStates, 'recent-findings')
                ? $this->feedPage($locale, 'desc', 'achado', self::FINDING_LIMIT)
                : null,
            'collection' => $this->sectionEnabled($sectionStates, 'recent-collections')
                ? $this->feedPage($locale, 'desc', 'colecao')
                : null,
        ]);

        $popular = $this->pageResults([
            'writing' => $this->sectionEnabled($sectionStates, 'popular-writing')
                ? $this->feedPage($locale, 'popular', 'post')
                : null,
            'finding' => $this->sectionEnabled($sectionStates, 'popular-findings')
                ? $this->feedPage($locale, 'popular', 'achado', self::FINDING_LIMIT)
                : null,
            'collection' => $this->sectionEnabled($sectionStates, 'popular-collections')
                ? $this->feedPage($locale, 'popular', 'colecao')
                : null,
        ]);

        $collectionsPage = $this->sectionEnabled($sectionStates, 'portfolio-collections')
            || $this->sectionEnabled($sectionStates, 'collection-showcases')
            ? $this->collections->listPaginated(self::LIMIT, 'desc', $locale)
            : null;
        $portfolio = $this->pageResults([
            'cases' => $this->sectionEnabled($sectionStates, 'portfolio-cases')
                ? $this->cases->listPaginated(self::LIMIT, 'desc')
                : null,
            'projects' => $this->sectionEnabled($sectionStates, 'portfolio-projects')
                ? $this->projects->listPaginated(self::LIMIT, 'desc')
                : null,
            'experiments' => $this->sectionEnabled($sectionStates, 'portfolio-experiments')
                ? $this->projects->listExperimentsPaginated(self::LIMIT, 'desc')
                : null,
            'collections' => $this->sectionEnabled($sectionStates, 'portfolio-collections')
                ? $collectionsPage
                : null,
            'snippets' => $this->sectionEnabled($sectionStates, 'portfolio-snippets')
                ? $this->snippets->listPaginated(self::LIMIT, 'desc')
                : null,
            'technologies' => $this->sectionEnabled($sectionStates, 'portfolio-technologies')
                ? $this->technologies->listPaginated(self::LIMIT, 'order')
                : null,
            'topics' => $this->sectionEnabled($sectionStates, 'portfolio-topics')
                ? $this->topics->listPaginated(self::LIMIT, 'alpha')
                : null,
            'credits' => $this->sectionEnabled($sectionStates, 'portfolio-credits')
                ? $this->credits->listPaginated(self::LIMIT, 'desc')
                : null,
        ]);
        $highlights = $this->sectionEnabled($sectionStates, 'highlights')
            ? $this->highlights($portfolioRevision)
            : ['items' => [], 'total' => 0];
        $collectionItems = $collectionsPage?->getCollection()->all() ?? [];
        $collectionShowcases = $this->sectionEnabled($sectionStates, 'collection-showcases')
            ? array_map(
                fn ($collection): array => [
                    'collection' => $collection,
                    'resources' => $this->collections->resourcesForHome($collection, self::LIMIT)->all(),
                ],
                $collectionItems,
            )
            : [];

        return new GetPublicHomeGalleryQueryResult(
            highlights: $highlights['items'],
            recent: $recent['items'],
            popular: $popular['items'],
            portfolio: $portfolio['items'],
            collectionShowcases: $collectionShowcases,
            totals: [
                'highlights' => $highlights['total'],
                'recent' => $recent['totals'],
                'popular' => $popular['totals'],
                'portfolio' => $portfolio['totals'],
                'collection_showcases' => $collectionsPage?->total() ?? 0,
            ],
        );
    }

    private function homeRevision(): ?PageRevision
    {
        return Page::query()
            ->where('slug', 'home')
            ->where(fn ($visibility) => $visibility
                ->where('pages.hidden', false)
                ->orWhereNull('pages.hidden'))
            ->whereHas('currentRevision', static function ($query): void {
                $query->where(fn ($visibility) => $visibility
                    ->where('hidden', false)
                    ->orWhereNull('hidden'));
            })
            ->with([
                'currentRevision.homeSections',
            ])
            ->first()?->currentRevision;
    }

    private function portfolioRevision(): ?PageRevision
    {
        return Page::query()
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
    }

    private function pageResults(array $pages): array
    {
        $items = [];
        $totals = [];

        foreach ($pages as $key => $page) {
            $items[$key] = $page?->getCollection()->all() ?? [];
            $totals[$key] = $page?->total() ?? 0;
        }

        return ['items' => $items, 'totals' => $totals];
    }

    private function sectionEnabled(array $states, string $key): bool
    {
        return $states[$key] ?? HomeGallerySection::DEFAULTS[$key] ?? true;
    }

    private function feedPage(
        string $locale,
        string $sort,
        string $kind,
        int $limit = self::LIMIT,
    ): LengthAwarePaginator {
        return $this->feed->listPaginated(
            $limit,
            1,
            $sort,
            $kind,
            $locale,
            null,
            null,
            null,
        );
    }

    private function highlights(?PageRevision $revision): array
    {
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
