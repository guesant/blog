<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicFindingQueryResult;
use App\Content\Locale;
use App\Content\PublicIdentifier;
use App\OpenGraph\OgImageUrlGenerator;

final class PublicFindingResponseFactory
{
    public function __construct(
        private readonly OgImageUrlGenerator $ogImages,
    ) {}

    public function detail(GetPublicFindingQueryResult $result, string $locale): PublicFindingResponseDto
    {
        return PublicFindingResponseDto::fromArray($this->item($result->resource, $locale, []));
    }

    public function summary(object $resource, string $locale): array
    {
        return $this->item($resource, $locale, null);
    }

    private function item(
        object $resource,
        string $locale,
        ?array $relations,
    ): array {
        $translation = $resource->translation($locale);

        $data = [
            'slug' => $resource->slug,
            'url' => Locale::url('/findings/'.PublicIdentifier::key($resource), $locale),
            'type' => $resource->type,
            'authors' => $resource->authors,
            'organizations' => $resource->organizations,
            'published_date' => optional($resource->published_date_iso)->toDateString(),
            'found_date' => optional($resource->found_date_iso)->toDateString(),
            'rating' => $resource->rating,
            'consumption_state' => $resource->consumption_state,
            'type_details' => $resource->type_details,
            'title' => $translation?->title,
            'alternative_title' => $translation?->alternative_title,
            'description' => $translation?->description,
            'personal_note' => $translation?->personal_note,
            'reason_found' => $translation?->reason_found,
            'og_image_url' => $this->ogImages->generate(
                'article',
                $translation?->title ?? $resource->slug,
                $translation?->description,
            ),
            'updated_date' => optional($resource->updated_at)->toDateString(),
            'topics' => $resource->topics->map(fn ($topic) => [
                'slug' => $topic->slug,
                'name' => $topic->translation($locale)?->name,
                'url' => Locale::url('/topics/'.PublicIdentifier::key($topic), $locale),
            ])->values()->all(),
            'links' => $resource->links->map(function ($link): array {
                return [
                    'url' => $link->url,
                    'label' => $link->label,
                    'platform' => $link->platform,
                    'purpose' => $link->purpose,
                    'is_free' => $link->is_free,
                    'is_primary' => $link->is_primary,
                ];
            })->values()->all(),
            'identifiers' => $resource->identifiers->map(fn ($identifier) => [
                'kind' => $identifier->kind,
                'value' => $identifier->value,
            ])->values()->all(),
            'related' => null,
            'relations' => $relations ?? [],
            'featured' => (bool) $resource->featured,
            'featured_order' => $resource->featured_order,
        ];

        return $data;
    }
}
