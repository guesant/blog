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
            'feed' => self::feedItems($result->feed, $presenter, $locale),
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

    private static function feedItems(
        array $items,
        PublicContentResponseFactory $presenter,
        string $locale,
    ): array {
        return array_values(array_map(
            fn (PublicFeedItem $item): array => $presenter->feedItem($item, $locale),
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
            'items' => [],
        ];
    }
}
