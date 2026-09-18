<?php

namespace App\Content;

use App\Models\Resource;

class ResourceApiTransformer
{
    public function toArray(Resource $resource, string $locale): array
    {
        $translation = $resource->translation($locale);

        return [
            'slug' => $resource->slug,
            'url' => Locale::url("/findings/{$this->key($resource)}", $locale),
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
            'updated_date' => optional($resource->updated_at)->toDateString(),
            'topics' => $resource->topics->map(fn ($topic) => [
                'slug' => $topic->slug,
                'name' => $topic->translation($locale)?->name,
                'url' => Locale::url("/topics/{$this->key($topic)}", $locale),
            ])->values()->all(),
            'links' => $resource->links->map(fn ($link) => [
                'url' => $link->url,
                'label' => $link->label,
                'platform' => $link->platform,
                'purpose' => $link->purpose,
                'is_free' => $link->is_free,
                'is_primary' => $link->is_primary,
            ])->values()->all(),
            'identifiers' => $resource->identifiers->map(fn ($identifier) => [
                'kind' => $identifier->kind,
                'value' => $identifier->value,
            ])->values()->all(),
            'related' => null,
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
    }

    private function key(object $model): string
    {
        return $model->public_id ? "{$model->public_id}-{$model->slug}" : $model->slug;
    }
}
