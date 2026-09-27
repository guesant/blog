<?php

namespace App\Content\Graph;

use App\Content\Locale;
use App\Models\ContentRelation;
use App\Models\RelationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class RelationResolver
{
    public function for(Model $node, ?string $locale = null): Collection
    {
        $locale = Locale::normalize($locale);

        $outbound = collect(ContentRelation::where('subject_type', $node->getMorphClass())
            ->where('subject_id', $node->getKey())
            ->with(['relationType.translations', 'object'])
            ->get())
            ->map(fn (ContentRelation $relation) => $this->resolve($relation, $relation->object, 'outbound', $locale));

        $inbound = collect(ContentRelation::where('object_type', $node->getMorphClass())
            ->where('object_id', $node->getKey())
            ->with(['relationType.translations', 'subject'])
            ->get())
            ->map(fn (ContentRelation $relation) => $this->resolve($relation, $relation->subject, 'inbound', $locale));

        return $outbound->merge($inbound)->filter()->values();
    }

    private function resolve(ContentRelation $relation, $target, string $direction, string $locale): ?array
    {
        if (! $relation->relationType || ! $target instanceof GraphNode) {
            return null;
        }

        if (! $target->graphIsVisible()) {
            return null;
        }

        if ($relation->visibility !== null && $relation->visibility !== 'public') {
            return null;
        }

        return [
            'relationType' => $relation->relationType->key,
            'family' => $relation->relationType->family,
            'direction' => $direction,
            'label' => $this->resolveLabel($relation->relationType, $direction, $locale),
            'targetSlug' => $target->slug,
            'targetKind' => NodeRegistry::kindFor($target),
            'targetTitle' => $target->graphLabel($locale),
            'targetUrl' => $target->graphUrl($locale),
            'note' => $relation->note,
            'context' => $relation->context,
            'status' => $relation->status,
        ];
    }

    private function resolveLabel(RelationType $relationType, string $direction, string $locale): string
    {
        $translation = $relationType->translation($locale);

        if ($translation === null) {
            return $relationType->key;
        }

        if ($relationType->symmetric) {
            return $translation->outbound_label ?: $relationType->key;
        }

        $label = $direction === 'outbound'
            ? $translation->outbound_label
            : $translation->inbound_label;

        return $label ?: $relationType->key;
    }
}
