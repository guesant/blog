<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Content\Locale;
use App\Content\PublicIdentifier;
use App\Models\ReferenceCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ReferenceCollectionReader
{
    use SortsListings;

    public function listPaginated(
        int $perPage = 20,
        ?string $sort = null,
        ?string $locale = null,
        ?string $search = null,
    ): LengthAwarePaginator {
        $query = ReferenceCollection::query()
            ->published()
            ->with('publishedTranslations')
            ->withCount([
                'resources' => static fn ($resource) => $resource
                    ->whereNotNull('resources.published_revision_id')
                    ->whereHas('publishedRevision', static fn ($revision) => $revision
                        ->where('hidden', false)
                        ->orWhereNull('hidden')
                        ->where('visibility', 'public')),
            ]);

        if (filled($search)) {
            $term = '%'.$search.'%';
            $query->whereHas('publishedTranslations', function ($translation) use ($locale, $term): void {
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

    public function findByIdentifier(string $identifier): ?ReferenceCollection
    {
        $collection = PublicIdentifier::constrain(ReferenceCollection::query()->published(), $identifier)
            ->with('publishedTranslations')
            ->first();

        return $collection;
    }

    public function findBySlug(string $slug): ?ReferenceCollection
    {
        return $this->findByIdentifier($slug);
    }

    public function resourcesPaginated(ReferenceCollection $collection, int $perPage = 20, int $page = 1): LengthAwarePaginator
    {
        return $collection->resources()
            ->whereNotNull('resources.published_revision_id')
            ->whereHas('publishedRevision', static fn ($query) => $query
                ->where(fn ($visibility) => $visibility->where('hidden', false)->orWhereNull('hidden'))
                ->where('visibility', 'public'))
            ->with([
                'publishedTranslations',
                'topics' => static fn ($query) => $query->published(),
                'topics.publishedTranslations',
            ])
            ->orderBy('reference_collection_item.order')
            ->orderBy('resources.id')
            ->paginate($perPage, ['resources.*'], 'page', max(1, $page));
    }

    public function resourcesForHome(ReferenceCollection $collection, int $limit = 6): Collection
    {
        return $collection->resources()
            ->whereNotNull('resources.published_revision_id')
            ->whereHas('publishedRevision', static fn ($query) => $query
                ->where(fn ($visibility) => $visibility->where('hidden', false)->orWhereNull('hidden'))
                ->where('visibility', 'public'))
            ->with([
                'publishedTranslations',
                'topics' => static fn ($query) => $query->published(),
                'topics.publishedTranslations',
            ])
            ->orderBy('reference_collection_item.order')
            ->orderBy('resources.id')
            ->limit($limit)
            ->get(['resources.*']);
    }

    public function related(ReferenceCollection $collection, int $limit = 3): Collection
    {
        return ReferenceCollection::query()
            ->published()
            ->where('id', '!=', $collection->id)
            ->with('publishedTranslations')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
