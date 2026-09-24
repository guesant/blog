<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Content\Graph\RelationResolver;
use App\Content\Locale;
use App\Models\Resource;
use App\Models\Topic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ResourceReader
{
    use SortsListings;

    public function paginate(array $filters = [], ?string $locale = null, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $locale = Locale::normalize($locale);

        $query = Resource::public();

        $this->applyFilters($query, $filters, $locale);
        $query->select($this->listingColumns());

        if ($sort === 'popular') {
            $query->orderByDesc('popularity_rank')->orderBy('order')->orderBy('id');
        } else {
            $this->applySort(
                $query,
                $sort,
                'found_date_iso',
                alphaTable: 'resource_revision_translations',
                alphaForeignKey: 'resource_revision_id',
                alphaColumn: 'title',
                locale: $locale,
            );
        }

        return $query->with($this->listingRelations())
            ->paginate($perPage);
    }

    public function listByTypePaginated(string $type, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Resource::public()->where('type', $type);
        $query->select($this->listingColumns());

        $this->applySort($query, $sort, 'published_date_iso', alphaTable: 'resource_revision_translations', alphaForeignKey: 'resource_revision_id', alphaColumn: 'title');

        return $query->with($this->listingRelations())
            ->paginate($perPage);
    }

    public function listByTopicPaginated(int $topicId, int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Resource::public()->whereHas('topics', fn ($t) => $t->where('topics.id', $topicId));
        $query->select($this->listingColumns());

        $this->applySort($query, $sort, 'published_date_iso', alphaTable: 'resource_revision_translations', alphaForeignKey: 'resource_revision_id', alphaColumn: 'title');

        return $query->with($this->listingRelations())
            ->paginate($perPage);
    }

    /**
     * @return array{
     *     types: list<string>,
     *     ratings: list<string>,
     *     consumptionStates: list<string>,
     *     years: list<string>,
     *     topics: list<array{slug: string, name: string}>
     * }
     */
    public function facetOptions(?string $locale = null): array
    {
        $locale = Locale::normalize($locale);
        $cached = Cache::get("resource-facets:v2:{$locale}");

        return is_array($cached) ? $cached : $this->emptyFacetOptions();
    }

    public function buildFacetOptions(?string $locale = null): array
    {
        $locale = Locale::normalize($locale);

        $public = Resource::public();

        /** @param Builder<resource> $q */
        $onlyPublicFindings = function ($q): void {
            $q->public();
        };

        return [
            'types' => (clone $public)->distinct()->orderBy('type')->pluck('type')->all(),
            'ratings' => (clone $public)->whereNotNull('rating')->distinct()->orderBy('rating')->pluck('rating')->all(),
            'consumptionStates' => (clone $public)->whereNotNull('consumption_state')->distinct()->orderBy('consumption_state')->pluck('consumption_state')->all(),
            'years' => (clone $public)
                ->whereNotNull('published_date_iso')
                ->selectRaw('EXTRACT(YEAR FROM published_date_iso) AS year')
                ->distinct()
                ->orderByDesc('year')
                ->pluck('year')
                ->map(fn (string|int|float $year) => (string) (int) $year)
                ->values()
                ->all(),
            'topics' => Topic::whereHas('findings', $onlyPublicFindings)
                ->with('translations')
                ->get()
                ->map(fn (Topic $topic) => [
                    'slug' => $topic->slug,
                    'name' => $topic->translation($locale)?->name ?? $topic->slug,
                ])
                ->values()
                ->all(),
        ];
    }

    private function applyFilters(Builder $query, array $filters, string $locale): void
    {
        if (filled($filters['q'] ?? null)) {
            $term = '%'.$filters['q'].'%';
            $query->where(function ($outer) use ($term, $locale) {
                $outer->whereHas('currentRevision.attributions', fn ($attribution) => $attribution->where('name', 'ilike', $term))
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
            $year = (int) $filters['year'];
            $query->whereBetween('published_date_iso', ["{$year}-01-01", ($year + 1).'-01-01']);
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

    private function listingRelations(): array
    {
        return [
            'translations:id,resource_id,locale,title,alternative_title,description,personal_note,reason_found',
            'topics:id,slug,public_id',
            'topics.translations:id,topic_id,locale,name',
            'links:id,resource_id,url,label,platform,purpose,is_free,is_primary',
            'identifiers:id,resource_id,kind,value',
        ];
    }

    private function listingColumns(): array
    {
        return [
            'id',
            'slug',
            'public_id',
            'hidden',
            'order',
            'type',
            'published_date_iso',
            'found_date_iso',
            'consumption_state',
            'rating',
            'visibility',
            'updated_at',
            'featured',
            'featured_order',
            'popularity_kind',
            'popularity_rank',
            'popularity_value',
        ];
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
