<?php

namespace App\Http\Responses;

use App\Application\PublicSite\PublicHomeGalleryReadResult;

final readonly class PublicHomeGalleryResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(
        PublicHomeGalleryReadResult $result,
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
            'recent' => [
                'feed' => array_values(array_map(
                    fn ($item): array => self::galleryItem($presenter->feedItem($item, $locale)),
                    $result->recentFeed,
                )),
                'projects' => array_values(array_map(
                    fn ($item): array => self::galleryItem(
                        $presenter->collectionItem('projects', $item, $locale),
                    ),
                    $result->recentProjects,
                )),
            ],
            'popular' => array_values(array_map(
                fn ($item): array => self::galleryItem($presenter->feedItem($item, $locale)),
                $result->popular,
            )),
            'collections' => array_values(array_map(
                fn ($item): array => self::galleryItem(
                    $presenter->collectionItem('collections', $item, $locale),
                ),
                $result->collections,
            )),
            'projects' => array_values(array_map(
                fn ($item): array => self::galleryItem(
                    $presenter->collectionItem('projects', $item, $locale),
                ),
                $result->projects,
            )),
        ]);
    }

    public function toArray(): array
    {
        return $this->value;
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
}
