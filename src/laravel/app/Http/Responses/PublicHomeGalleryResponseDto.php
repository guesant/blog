<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicHomeGalleryQueryResult;
use App\Application\PublicSite\PublicFeedItem;

final readonly class PublicHomeGalleryResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(
        GetPublicHomeGalleryQueryResult $result,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): self {
        return new self([
            'highlights' => array_values(array_map(
                fn (array $entry): array => [
                    'kind' => $entry['kind'],
                    'item' => self::galleryItem(
                        $presenter->collectionItem($entry['kind'], $entry['item'], $locale),
                    ),
                ],
                $result->highlights,
            )),
            'recent' => self::feedCategories($result->recent, $presenter, $locale),
            'popular' => self::feedCategories($result->popular, $presenter, $locale),
            'portfolio' => self::portfolio($result->portfolio, $presenter, $locale),
            'collection_showcases' => array_values(array_map(
                fn (array $showcase): array => self::collectionShowcase($showcase, $presenter, $locale),
                $result->collectionShowcases,
            )),
            'totals' => $result->totals,
        ]);
    }

    public function toArray(): array
    {
        return $this->value;
    }

    private static function feedCategories(
        array $categories,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): array {
        return [
            'writing' => self::feedItems($categories['writing'] ?? [], $presenter, $locale),
            'finding' => self::feedItems($categories['finding'] ?? [], $presenter, $locale),
            'collection' => self::feedItems($categories['collection'] ?? [], $presenter, $locale),
        ];
    }

    private static function feedItems(
        array $items,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): array {
        return array_values(array_map(
            fn (PublicFeedItem $item): array => self::galleryItem($presenter->feedItem($item, $locale)),
            $items,
        ));
    }

    private static function portfolio(
        array $collections,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): array {
        return [
            'cases' => self::collectionItems($collections['cases'] ?? [], 'cases', $presenter, $locale),
            'projects' => self::collectionItems($collections['projects'] ?? [], 'projects', $presenter, $locale),
            'experiments' => self::collectionItems($collections['experiments'] ?? [], 'experiments', $presenter, $locale),
            'collections' => self::collectionItems($collections['collections'] ?? [], 'collections', $presenter, $locale),
            'snippets' => self::collectionItems($collections['snippets'] ?? [], 'snippets', $presenter, $locale),
            'technologies' => self::collectionItems($collections['technologies'] ?? [], 'technologies', $presenter, $locale),
            'topics' => self::collectionItems($collections['topics'] ?? [], 'topics', $presenter, $locale),
            'credits' => self::collectionItems($collections['credits'] ?? [], 'credits', $presenter, $locale),
        ];
    }

    private static function collectionItems(
        array $items,
        string $collection,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): array {
        return array_values(array_map(
            fn ($item): array => self::galleryItem($presenter->collectionItem($collection, $item, $locale)),
            $items,
        ));
    }

    private static function galleryItem(array $item): array
    {
        return [
            ...$item,
            'gallery_title' => $item['title'] ?? $item['name'] ?? $item['slug'] ?? '',
            'gallery_description' => $item['description']
                ?? $item['summary']
                ?? $item['purpose']
                ?? $item['preview']
                ?? $item['excerpt']
                ?? '',
            'href' => $item['href'] ?? $item['url'] ?? '',
        ];
    }

    private static function collectionShowcase(
        array $showcase,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): array {
        return [
            'collection' => self::galleryItem(
                $presenter->collectionItem('collections', $showcase['collection'], $locale),
            ),
            'items' => array_values(array_map(
                fn ($item): array => self::galleryItem(
                    $presenter->feedItem(new PublicFeedItem('achado', $item), $locale),
                ),
                $showcase['resources'],
            )),
        ];
    }
}
