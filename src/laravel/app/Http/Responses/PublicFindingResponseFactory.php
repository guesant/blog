<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicFindingQueryResult;
use App\Content\Locale;
use App\Content\OpenGraphMetadata;
use App\Content\PublicIdentifier;
use App\OpenGraph\OgImageUrlGenerator;
use App\Support\PublicMediaUrl;
use Illuminate\Pagination\LengthAwarePaginator;

final class PublicFindingResponseFactory
{
    public function __construct(
        private readonly OpenGraphMetadata $openGraph,
        private readonly OgImageUrlGenerator $ogImages,
        private readonly PublicMediaUrl $media,
    ) {}

    public function list(
        LengthAwarePaginator $page,
        string $locale,
        array $facets,
    ): PublicFindingListResponseDto {
        $data = $page->getCollection()
            ->map(fn (object $resource): array => $this->item($resource, $locale, null, true, false))
            ->all();

        return PublicFindingListResponseDto::fromPage(
            $data,
            PublicListMetaDto::fromPage($page, $locale, $facets),
        );
    }

    public function detail(GetPublicFindingQueryResult $result, string $locale): PublicFindingResponseDto
    {
        return PublicFindingResponseDto::fromArray($this->item($result->resource, $locale, [], true, true));
    }

    public function summary(object $resource, string $locale): array
    {
        return $this->item($resource, $locale, null, true, false);
    }

    private function item(
        object $resource,
        string $locale,
        ?array $relations,
        bool $includeOpenGraph,
        bool $includeSeo,
    ): array {
        $translation = $resource->translation($locale);
        $seo = $includeSeo ? $this->translationSeo($translation) : null;

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
            'og_image_url' => $this->ogImageUrl(
                $seo,
                $translation?->title ?? $resource->slug,
                $translation?->description,
            ),
            'updated_date' => optional($resource->updated_at)->toDateString(),
            'topics' => $resource->topics->map(fn ($topic) => [
                'slug' => $topic->slug,
                'name' => $topic->translation($locale)?->name,
                'url' => Locale::url('/topics/'.PublicIdentifier::key($topic), $locale),
            ])->values()->all(),
            'links' => $resource->links->map(function ($link) use ($includeOpenGraph): array {
                $result = [
                    'url' => $link->url,
                    'label' => $link->label,
                    'platform' => $link->platform,
                    'purpose' => $link->purpose,
                    'is_free' => $link->is_free,
                    'is_primary' => $link->is_primary,
                ];

                if ($includeOpenGraph) {
                    $result['open_graph'] = $this->openGraph->forUrl($link->url);
                }

                return $result;
            })->values()->all(),
            'identifiers' => $resource->identifiers->map(fn ($identifier) => [
                'kind' => $identifier->kind,
                'value' => $identifier->value,
            ])->values()->all(),
            'related' => null,
            'relations' => $relations ?? [],
            'popularity' => $resource->popularity_value !== null
                && $resource->popularity_kind !== null
                && $resource->popularity_rank !== null
                ? [
                    'value' => (int) $resource->popularity_value,
                    'kind' => $resource->popularity_kind,
                    'rank' => (float) $resource->popularity_rank,
                ]
                : null,
            'featured' => (bool) $resource->featured,
            'featured_order' => $resource->featured_order,
        ];

        if ($seo !== null) {
            $data['seo'] = $seo;
        }

        return $data;
    }

    private function translationSeo(?object $translation): ?array
    {
        $seo = $translation?->seo;
        $rewritten = $this->media->rewrite($seo);

        return is_array($rewritten) ? $rewritten : null;
    }

    private function ogImageUrl(?array $seo, string $title, ?string $description): ?string
    {
        $image = $seo['image'] ?? null;

        return is_string($image) && trim($image) !== ''
            ? $image
            : $this->ogImages->generate('article', $title, $description);
    }
}
