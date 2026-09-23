<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\ReferenceCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReferenceCollectionQuery
{
    use SortsListings;

    public function listPaginated(
        int $perPage = 20,
        ?string $sort = null,
        ?string $locale = null,
        ?string $search = null,
    ): LengthAwarePaginator {
        $query = ReferenceCollection::where('hidden', false)
            ->with('translations')
            ->withCount('resources');

        if (filled($search)) {
            $term = '%'.$search.'%';
            $query->whereHas('translations', function ($translation) use ($locale, $term): void {
                $translation->where('locale', Locale::normalize($locale))
                    ->where(function ($fields) use ($term): void {
                        $fields->where('title', 'ilike', $term)
                            ->orWhere('description', 'ilike', $term);
                    });
            });
        }

        $this->applySort($query, $sort, alphaTable: 'reference_collection_revision_translations', alphaForeignKey: 'reference_collection_revision_id', alphaColumn: 'title');

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
