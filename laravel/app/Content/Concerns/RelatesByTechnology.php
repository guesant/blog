<?php

namespace App\Content\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

/**
 * Shared "related items" resolution: prefer other visible records sharing at
 * least one technology, most recently published first, falling back to the
 * most recently published visible records when none share a technology.
 */
trait RelatesByTechnology
{
    /**
     * @param  Builder<*>  $baseQuery  Already scoped to "visible, excluding self".
     * @param  Collection<int, int>  $technologyIds
     * @param  list<string>  $with
     * @return Collection<int, mixed>
     */
    private function relatedByTechnology(Builder $baseQuery, Collection $technologyIds, int $limit, array $with): Collection
    {
        if ($technologyIds->isNotEmpty()) {
            $result = (clone $baseQuery)
                ->whereHas('technologies', fn ($q) => $q->whereIn('technologies.id', $technologyIds))
                ->orderBy('published_at', 'desc')
                ->limit($limit)
                ->with($with)
                ->get();

            if ($result->isNotEmpty()) {
                return $result;
            }
        }

        return $baseQuery->orderBy('published_at', 'desc')
            ->limit($limit)
            ->with($with)
            ->get();
    }
}
