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

    private const FEED_LIMIT = 15;

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

        $feedPage = $this->sectionEnabled($sectionStates, 'feed')
            ? $this->feedPage($locale, 'desc', null, self::FEED_LIMIT)
            : null;

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
        $collectionItems = $collectionsPage?->items() ?? [];
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
            feed: $feedPage?->items() ?? [],
            portfolio: $portfolio['items'],
            collectionShowcases: $collectionShowcases,
            totals: [
                'highlights' => $highlights['total'],
                'feed' => $feedPage?->total() ?? 0,
                'portfolio' => $portfolio['totals'],
                'collection_showcases' => $collectionsPage?->total() ?? 0,
            ],
        );
    }

    private function homeRevision(): ?PageRevision
    {
        return Page::query()
            ->published()
            ->where('slug', 'home')
            ->with('publishedRevision.homeSections')
            ->first()?->publishedRevision;
    }

    private function portfolioRevision(): ?PageRevision
    {
        return Page::query()
            ->published()
            ->where('slug', 'portfolio')
            ->with([
                'publishedRevision.featuredCases' => static fn ($query) => $query
                    ->published()
                    ->whereHas('publishedRevision', static fn ($revision) => $revision->where('nda', false)),
                'publishedRevision.featuredCases.publishedTranslations',
                'publishedRevision.featuredCases.technologies' => static fn ($query) => $query->published(),
                'publishedRevision.featuredCases.technologies.publishedTranslations',
                'publishedRevision.featuredProjects' => static fn ($query) => $query
                    ->published()
                    ->whereHas('publishedRevision', static fn ($revision) => $revision->where('nda', false)),
                'publishedRevision.featuredProjects.publishedTranslations',
                'publishedRevision.featuredProjects.technologies' => static fn ($query) => $query->published(),
                'publishedRevision.featuredProjects.technologies.publishedTranslations',
                'publishedRevision.featuredWritings' => static fn ($query) => $query->published(),
                'publishedRevision.featuredWritings.publishedTranslations',
                'publishedRevision.featuredWritings.topics' => static fn ($query) => $query->published(),
                'publishedRevision.featuredWritings.topics.publishedTranslations',
            ])
            ->first()?->publishedRevision;
    }

    private function pageResults(array $pages): array
    {
        $items = [];
        $totals = [];

        foreach ($pages as $key => $page) {
            $items[$key] = $page?->items() ?? [];
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
        ?string $kind,
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
