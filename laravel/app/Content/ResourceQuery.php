<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Content\Graph\RelationResolver;
use App\Models\Resource;
use App\Models\Topic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class ResourceQuery
{
    use SortsListings;

    public function list(array $filters = [], ?string $locale = null): Collection
    {
        $locale = Locale::normalize($locale);

        $query = Resource::public();

        $this->applyFilters($query, $filters, $locale);

        return $query->orderBy('order')
            ->with(['translations', 'topics.translations', 'links', 'identifiers'])
            ->get();
    }

    public function paginate(array $filters = [], ?string $locale = null, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $locale = Locale::normalize($locale);

        $query = Resource::public();

        $this->applyFilters($query, $filters, $locale);

        $this->applySort($query, $sort, alphaTable: 'resource_translations', alphaForeignKey: 'resource_id', alphaColumn: 'title');

        return $query->with(['translations', 'topics.translations', 'links', 'identifiers'])
            ->paginate($perPage);
    }

    public function listByTypePaginated(string $type, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Resource::public()->where('type', $type);

        $this->applySort($query, $sort, 'published_date_iso', alphaTable: 'resource_translations', alphaForeignKey: 'resource_id', alphaColumn: 'title');

        return $query->with(['translations', 'topics.translations', 'links', 'identifiers'])
            ->paginate($perPage);
    }

    public function listByTopicPaginated(int $topicId, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Resource::public()->whereHas('topics', fn ($t) => $t->where('topics.id', $topicId));

        $this->applySort($query, $sort, 'published_date_iso', alphaTable: 'resource_translations', alphaForeignKey: 'resource_id', alphaColumn: 'title');

        return $query->with(['translations', 'topics.translations', 'links', 'identifiers'])
            ->paginate($perPage);
    }

    /**
     * Distinct facet values across all public resources, independent of the
     * filters currently applied — mirrors the legacy client-side search bar,
     * whose facet dropdowns were always built from the full dataset rather
     * than narrowing as other facets were picked.
     */
    public function facetOptions(): array
    {
        $public = Resource::public();

        /** @param Builder<resource> $q */
        $onlyPublicFindings = function ($q): void {
            $q->public();
        };

        return [
            'types' => (clone $public)->distinct()->orderBy('type')->pluck('type')->all(),
            'ratings' => (clone $public)->whereNotNull('rating')->distinct()->orderBy('rating')->pluck('rating')->all(),
            'consumptionStates' => (clone $public)->whereNotNull('consumption_state')->distinct()->orderBy('consumption_state')->pluck('consumption_state')->all(),
            'years' => (clone $public)->whereNotNull('published_date_iso')
                ->get()
                ->map(fn (Resource $resource) => $resource->published_date_iso->format('Y'))
                ->unique()
                ->sortDesc()
                ->values()
                ->all(),
            'topics' => Topic::whereHas('findings', $onlyPublicFindings)
                ->with('translations')
                ->get(),
        ];
    }

    private function applyFilters(Builder $query, array $filters, string $locale): void
    {
        if (filled($filters['q'] ?? null)) {
            $term = '%'.$filters['q'].'%';
            $query->where(function ($outer) use ($term, $locale) {
                $outer->where('authors', 'ilike', $term)
                    ->orWhere('organizations', 'ilike', $term)
                    ->orWhereHas('translations', function ($t) use ($term, $locale) {
                        $t->where('locale', $locale)
                            ->where(function ($tt) use ($term) {
                                $tt->where('title', 'like', $term)
                                    ->orWhere('alternative_title', 'ilike', $term)
                                    ->orWhere('description', 'ilike', $term)
                                    ->orWhere('reason_found', 'ilike', $term);
                            });
                    })
                    ->orWhereHas('identifiers', fn ($i) => $i->where('value', 'ilike', $term))
                    ->orWhereHas('links', fn ($l) => $l->where('platform', 'ilike', $term))
                    ->orWhereHas('topics.translations', function ($tt) use ($term, $locale) {
                        $tt->where('locale', $locale)->where('name', 'ilike', $term);
                    });
            });
        }

        if (filled($filters['type'] ?? null)) {
            $query->where('type', $filters['type']);
        }

        if (filled($filters['topic'] ?? null)) {
            $query->whereHas('topics', fn ($t) => $t->where('slug', $filters['topic']));
        }

        if (filled($filters['rating'] ?? null)) {
            $query->where('rating', $filters['rating']);
        }

        if (filled($filters['consumption_state'] ?? null)) {
            $query->where('consumption_state', $filters['consumption_state']);
        }

        if (filled($filters['year'] ?? null)) {
            $query->whereYear('published_date_iso', $filters['year']);
        }

        if (filled($filters['free_only'] ?? null)) {
            $query->whereHas('links', fn ($l) => $l->where('is_free', true));
        }
    }

    public function related(Resource $resource, int $limit = 3): Collection
    {
        $topic = $resource->topics->first();

        if ($topic) {
            return Resource::public()
                ->where('id', '!=', $resource->id)
                ->whereHas('topics', fn ($t) => $t->where('topics.id', $topic->id))
                ->with('translations')
                ->orderByDesc('published_date_iso')
                ->limit($limit)
                ->get();
        }

        return Resource::public()
            ->where('id', '!=', $resource->id)
            ->where('type', $resource->type)
            ->with('translations')
            ->orderByDesc('published_date_iso')
            ->limit($limit)
            ->get();
    }

    public function findBySlug(string $slug, ?string $locale = null): ?array
    {
        $resource = Resource::where('slug', $slug)
            ->public()
            ->with(['translations', 'topics.translations', 'authorTopics.translations', 'publisherTopics.translations', 'links', 'identifiers'])
            ->first();

        if (! $resource) {
            return null;
        }

        return [
            'resource' => $resource,
            'relations' => (new RelationResolver)->for($resource, $locale)->all(),
        ];
    }
}
