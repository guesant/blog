<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\ReferenceCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReferenceCollectionQuery
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = ReferenceCollection::where('hidden', false)
            ->with('translations')
            ->withCount('resources');

        $this->applySort($query, $sort, alphaTable: 'reference_collection_translations', alphaForeignKey: 'reference_collection_id', alphaColumn: 'title');

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?ReferenceCollection
    {
        $collection = ReferenceCollection::where('slug', $slug)
            ->where('hidden', false)
            ->with('translations')
            ->first();

        return $collection;
    }

    public function resourcesPaginated(ReferenceCollection $collection, int $perPage = 20, int $page = 1): LengthAwarePaginator
    {
        return $collection->resources()
            ->where('resources.hidden', false)
            ->where('resources.visibility', 'public')
            ->with(['translations', 'topics.translations'])
            ->orderBy('reference_collection_item.order')
            ->orderBy('resources.id')
            ->paginate($perPage, ['resources.*'], 'page', max(1, $page));
    }

    public function related(ReferenceCollection $collection, int $limit = 3): Collection
    {
        return ReferenceCollection::where('hidden', false)
            ->where('id', '!=', $collection->id)
            ->with('translations')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
