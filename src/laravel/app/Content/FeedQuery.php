<?php

namespace App\Content;

use App\Application\PublicSite\PublicFeedItem;
use App\Models\ReferenceCollection;
use App\Models\Resource;
use App\Models\Writing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Query\Builder;
use Illuminate\Pagination\LengthAwarePaginator as Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class FeedQuery
{
    public function listPaginated(
        int $perPage,
        int $page,
        ?string $sort,
        ?string $kind,
        ?string $locale,
        ?string $search,
        ?string $type,
        ?string $topic,
    ): LengthAwarePaginator {
        $locale = Locale::normalize($locale);
        $sources = $this->sources($kind, $locale, $search, $type, $topic);

        if ($sources === []) {
            return new Paginator([], 0, $perPage, $page);
        }

        $query = array_shift($sources);
        foreach ($sources as $source) {
            $query->unionAll($source);
        }

        $pageResult = $this->order($query, $sort)->paginate(
            $perPage,
            ['*'],
            'page',
            max(1, $page),
        );

        $pageResult->setCollection($this->hydrate($pageResult->getCollection()));

        return $pageResult;
    }

    private function sources(
        ?string $kind,
        string $locale,
        ?string $search,
        ?string $type,
        ?string $topic,
    ): array {
        $sources = [];

        if ($kind === null || $kind === 'post') {
            $sources[] = $this->writingSource($locale, $search, $topic);
        }

        if ($kind === null || $kind === 'achado') {
            $sources[] = $this->findingSource($locale, $search, $type, $topic);
        }

        if (($kind === null || $kind === 'colecao') && ! filled($topic)) {
            $sources[] = $this->collectionSource($locale, $search, $topic);
        }

        return array_values(array_filter($sources));
    }

    private function writingSource(string $locale, ?string $search, ?string $topic): Builder
    {
        $query = DB::table('writings')
            ->leftJoin('writing_revision_translations', function ($join) use ($locale): void {
                $join->on(
                    'writing_revision_translations.writing_revision_id',
                    '=',
                    'writings.current_revision_id',
                )->where('writing_revision_translations.locale', $locale);
            })
            ->where('writings.hidden', false)
            ->select([
                DB::raw("'post' as kind"),
                'writings.id as content_id',
                'writings.date_iso as date_value',
                'writing_revision_translations.title as title_value',
                DB::raw('0 as popularity_value'),
            ]);

        if (filled($search)) {
            $term = '%'.$search.'%';
            $query->where(function (Builder $fields) use ($term): void {
                $fields->where('writing_revision_translations.title', 'ilike', $term)
                    ->orWhere('writing_revision_translations.excerpt', 'ilike', $term);
            });
        }

        $this->applyTopic($query, 'writing', $topic, 'writings.id');

        return $query;
    }

    private function findingSource(
        string $locale,
        ?string $search,
        ?string $type,
        ?string $topic,
    ): Builder {
        $query = DB::table('resources')
            ->leftJoin('resource_revision_translations', function ($join) use ($locale): void {
                $join->on(
                    'resource_revision_translations.resource_revision_id',
                    '=',
                    'resources.current_revision_id',
                )->where('resource_revision_translations.locale', $locale);
            })
            ->where('resources.hidden', false)
            ->where('resources.visibility', 'public')
            ->select([
                DB::raw("'achado' as kind"),
                'resources.id as content_id',
                DB::raw('COALESCE(resources.found_date_iso, resources.published_date_iso) as date_value'),
                'resource_revision_translations.title as title_value',
                DB::raw('COALESCE(resources.popularity_rank, 0) as popularity_value'),
            ]);

        if (filled($search)) {
            $term = '%'.$search.'%';
            $query->where(function (Builder $fields) use ($term): void {
                $fields->where('resource_revision_translations.title', 'ilike', $term)
                    ->orWhere('resource_revision_translations.alternative_title', 'ilike', $term)
                    ->orWhere('resource_revision_translations.description', 'ilike', $term)
                    ->orWhere('resource_revision_translations.reason_found', 'ilike', $term)
                    ->orWhere('resources.authors', 'ilike', $term)
                    ->orWhere('resources.organizations', 'ilike', $term);
            });
        }

        if (filled($type)) {
            $query->where('resources.type', $type);
        }

        $this->applyTopic($query, 'finding', $topic, 'resources.id');

        return $query;
    }

    private function collectionSource(string $locale, ?string $search, ?string $topic): Builder
    {
        $query = DB::table('reference_collections')
            ->leftJoin('reference_collection_revision_translations', function ($join) use ($locale): void {
                $join->on(
                    'reference_collection_revision_translations.reference_collection_revision_id',
                    '=',
                    'reference_collections.current_revision_id',
                )->where('reference_collection_revision_translations.locale', $locale);
            })
            ->where('reference_collections.hidden', false)
            ->select([
                DB::raw("'colecao' as kind"),
                'reference_collections.id as content_id',
                'reference_collections.published_at as date_value',
                'reference_collection_revision_translations.title as title_value',
                DB::raw('0 as popularity_value'),
            ]);

        if (filled($search)) {
            $term = '%'.$search.'%';
            $query->where(function (Builder $fields) use ($term): void {
                $fields->where('reference_collection_revision_translations.title', 'ilike', $term)
                    ->orWhere('reference_collection_revision_translations.description', 'ilike', $term);
            });
        }

        return $query;
    }

    private function applyTopic(Builder $query, string $morphType, ?string $topic, string $column): void
    {
        if (! filled($topic)) {
            return;
        }

        $query->whereExists(function (Builder $topics) use ($morphType, $topic, $column): void {
            $topics->selectRaw('1')
                ->from('topicables')
                ->join('topics', 'topics.id', '=', 'topicables.topic_id')
                ->whereColumn('topicables.topicable_id', $column)
                ->where('topicables.topicable_type', $morphType)
                ->where('topics.slug', $topic);
        });
    }

    private function order(Builder $query, ?string $sort): Builder
    {
        if ($sort === 'alpha') {
            return $query
                ->orderByRaw("lower(coalesce(title_value, ''))")
                ->orderBy('kind')
                ->orderBy('content_id');
        }

        if ($sort === 'popular') {
            return $query
                ->orderByDesc('popularity_value')
                ->orderByDesc('date_value')
                ->orderBy('kind')
                ->orderBy('content_id');
        }

        return $query
            ->orderBy('date_value', $sort === 'asc' ? 'asc' : 'desc')
            ->orderBy('kind')
            ->orderBy('content_id');
    }

    private function hydrate(Collection $rows): Collection
    {
        $ids = $rows->groupBy('kind')->map(fn (Collection $items): array => $items->pluck('content_id')->all());
        $models = [
            'post' => Writing::whereKey($ids->get('post', []))
                ->with(['translations', 'topics.translations'])
                ->get()
                ->keyBy('id'),
            'achado' => Resource::whereKey($ids->get('achado', []))
                ->with(['translations', 'topics.translations', 'links', 'identifiers'])
                ->get()
                ->keyBy('id'),
            'colecao' => ReferenceCollection::whereKey($ids->get('colecao', []))
                ->with('translations')
                ->get()
                ->keyBy('id'),
        ];

        return $rows->map(fn (object $row): PublicFeedItem => new PublicFeedItem(
            kind: $row->kind,
            content: $models[$row->kind][(int) $row->content_id],
        ));
    }
}
