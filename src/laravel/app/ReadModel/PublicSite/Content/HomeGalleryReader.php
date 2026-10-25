<?php

namespace App\ReadModel\PublicSite\Content;

use App\Application\PublicSite\GetPublicHomeGalleryQueryResult;
use App\Content\HomeGallerySection;
use App\Models\Page;
use App\Models\PageRevision;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class HomeGalleryReader
{
    private const FEED_LIMIT = 15;

    private const COLLECTION_LIMIT = 6;

    public function __construct(
        private readonly FeedReader $feed,
        private readonly ReferenceCollectionReader $collections,
    ) {}

    public function find(string $locale): GetPublicHomeGalleryQueryResult
    {
        $homeRevision = $this->homeRevision();
        $sectionStates = $homeRevision?->homeSections
            ->mapWithKeys(fn ($section): array => [$section->section_key => $section->enabled])
            ->all() ?? [];

        $feedPage = $this->sectionEnabled($sectionStates, 'feed')
            ? $this->feedPage($locale, 'desc', null, self::FEED_LIMIT)
            : null;

        $collectionsPage = $this->sectionEnabled($sectionStates, 'collection-showcases')
            ? $this->collections->listPaginated(self::COLLECTION_LIMIT, 'desc', $locale)
            : null;
        $collectionItems = $collectionsPage?->items() ?? [];
        $collectionShowcases = $this->sectionEnabled($sectionStates, 'collection-showcases')
            ? array_map(
                fn ($collection): array => [
                    'collection' => $collection,
                    'resources' => [],
                ],
                $collectionItems,
            )
            : [];

        return new GetPublicHomeGalleryQueryResult(
            feed: $feedPage?->items() ?? [],
            collectionShowcases: $collectionShowcases,
            totals: [
                'feed' => $feedPage?->total() ?? 0,
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

    private function sectionEnabled(array $states, string $key): bool
    {
        return $states[$key] ?? HomeGallerySection::DEFAULTS[$key] ?? true;
    }

    private function feedPage(
        string $locale,
        string $sort,
        ?string $kind,
        int $limit = self::FEED_LIMIT,
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
}
