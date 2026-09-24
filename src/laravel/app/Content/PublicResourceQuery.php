<?php

namespace App\Content;

use App\Models\ResourceRevision;
use App\Models\Topic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class PublicResourceQuery
{
    public function facetOptions(?string $locale = null): array
    {
        $normalized = Locale::normalize($locale);
        $cached = Cache::get("resource-facets:v3:{$normalized}");

        return is_array($cached) ? $cached : $this->emptyFacetOptions();
    }

    public function buildFacetOptions(?string $locale = null): array
    {
        $normalized = Locale::normalize($locale);
        $public = ResourceRevision::query()
            ->join('resources', 'resources.published_revision_id', '=', 'resource_revisions.id')
            ->where('resource_revisions.hidden', false)
            ->where('resource_revisions.visibility', 'public');
        $publicIds = (clone $public)->select('resource_revisions.id');

        return [
            'types' => (clone $public)->distinct()->orderBy('resource_revisions.type')->pluck('resource_revisions.type')->all(),
            'ratings' => (clone $public)->whereNotNull('resource_revisions.rating')->distinct()->orderBy('resource_revisions.rating')->pluck('resource_revisions.rating')->all(),
            'consumptionStates' => (clone $public)->whereNotNull('resource_revisions.consumption_state')->distinct()->orderBy('resource_revisions.consumption_state')->pluck('resource_revisions.consumption_state')->all(),
            'years' => (clone $public)
                ->whereNotNull('resource_revisions.published_date_iso')
                ->selectRaw('EXTRACT(YEAR FROM resource_revisions.published_date_iso) AS year')
                ->distinct()
                ->orderByDesc('year')
                ->pluck('year')
                ->map(fn (string|int|float $year): string => (string) (int) $year)
                ->values()
                ->all(),
            'topics' => Topic::query()
                ->where('hidden', false)
                ->whereIn('id', DB::table('resource_revision_topics')->whereIn('resource_revision_id', $publicIds)->select('topic_id'))
                ->with('translations')
                ->orderBy('slug')
                ->get()
                ->map(fn (Topic $topic): array => [
                    'slug' => $topic->slug,
                    'name' => $topic->translation($normalized)?->name ?? $topic->slug,
                ])
                ->values()
                ->all(),
        ];
    }

    public function paginate(array $filters = [], ?string $locale = null, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = $this->baseQuery($locale);

        $this->applyFilters($query, $filters, $locale ?? 'en');
        $this->applySort($query, $sort);

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier, ?string $locale = null): ?ResourceRevision
    {
        return PublicIdentifier::constrain(
            $this->baseQuery($locale),
            $identifier,
            'resource_revisions.public_id',
            'resource_revisions.slug',
        )
            ->with([
                'translations',
                'topics.translations',
                'links',
                'identifiers',
                'typeDetailRows',
                'attributions',
            ])
            ->first();
    }

    public function findBySlug(string $slug, ?string $locale = null): ?ResourceRevision
    {
        return $this->findByIdentifier($slug, $locale);
    }

    private function baseQuery(?string $locale): Builder
    {
        return ResourceRevision::query()
            ->join('resources', 'resources.published_revision_id', '=', 'resource_revisions.id')
            ->select('resource_revisions.*')
            ->with([
                'translations',
                'topics.translations',
                'links',
                'identifiers',
                'typeDetailRows',
                'attributions',
            ])
            ->where('resource_revisions.hidden', false)
            ->where('resource_revisions.visibility', 'public')
            ->when($locale !== null, fn (Builder $query) => $query->with('translations'));
    }

    private function applyFilters(Builder $query, array $filters, string $locale): void
    {
        if (filled($filters['q'] ?? null)) {
            $term = '%'.$filters['q'].'%';
            $query->where(function (Builder $outer) use ($term, $locale): void {
                $outer->whereHas('attributions', fn (Builder $attribution) => $attribution->where('name', 'ilike', $term))
                    ->orWhereHas('translations', function (Builder $translation) use ($term, $locale): void {
                        $translation->where('locale', $locale)->where(function (Builder $fields) use ($term): void {
                            $fields->where('title', 'ilike', $term)
                                ->orWhere('alternative_title', 'ilike', $term)
                                ->orWhere('description', 'ilike', $term)
                                ->orWhere('reason_found', 'ilike', $term);
                        });
                    })
                    ->orWhereHas('identifiers', fn (Builder $identifier) => $identifier->where('value', 'ilike', $term))
                    ->orWhereHas('links', fn (Builder $link) => $link->where('platform', 'ilike', $term))
                    ->orWhereHas('topics.translations', fn (Builder $translation) => $translation->where('locale', $locale)->where('name', 'ilike', $term));
            });
        }

        foreach (['type', 'rating', 'consumption_state'] as $field) {
            if (filled($filters[$field] ?? null)) {
                $query->where('resource_revisions.'.$field, $filters[$field]);
            }
        }

        if (filled($filters['topic'] ?? null)) {
            $query->whereHas('topics', fn (Builder $topic) => $topic->where('topics.slug', $filters['topic']));
        }

        if (filled($filters['year'] ?? null)) {
            $year = (int) $filters['year'];
            $query->whereBetween('published_date_iso', ["{$year}-01-01", ($year + 1).'-01-01']);
        }

        if (filled($filters['free_only'] ?? null)) {
            $query->whereHas('links', fn (Builder $link) => $link->where('is_free', true));
        }
    }

    private function applySort(Builder $query, ?string $sort): void
    {
        if ($sort === 'popular') {
            $query->orderByDesc('resource_revisions.popularity_rank');
        } elseif ($sort === 'alpha') {
            $query->orderBy('resource_revisions.slug');
        } elseif ($sort === 'asc') {
            $query->orderBy('resource_revisions.found_date_iso');
        } else {
            $query->orderByDesc('resource_revisions.found_date_iso');
        }

        $query->orderBy('resource_revisions.id');
    }

    private function emptyFacetOptions(): array
    {
        return [
            'types' => [],
            'ratings' => [],
            'consumptionStates' => [],
            'years' => [],
            'topics' => [],
        ];
    }
}
