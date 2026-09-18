<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\ReferenceCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReferenceCollectionQuery
{
    use SortsListings;

    public function list(): Collection
    {
        return ReferenceCollection::where('hidden', false)
            ->orderBy('order')
            ->with('translations')
            ->get();
    }

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
            ->with(['translations', 'resources'])
            ->first();

        if (! $collection) {
            return null;
        }

        $collection->setRelation('resources', $collection->resources
            ->filter(fn ($resource) => ! $resource->hidden && $resource->visibility === 'public')
            ->sortBy('pivot.order')
            ->values());

        return $collection;
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
