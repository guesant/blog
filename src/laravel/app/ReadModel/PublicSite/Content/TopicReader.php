<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Content\PublicIdentifier;
use App\Models\Topic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TopicReader
{
    use SortsListings;

    public function listPaginated(int $perPage = 50, ?string $sort = null): LengthAwarePaginator
    {
        $query = Topic::query()
            ->published()
            ->with([
                'publishedTranslations',
                'parent' => static fn ($query) => $query->published(),
                'parent.publishedTranslations',
                'children' => static fn ($query) => $query->published(),
                'children.publishedTranslations',
            ]);

        $this->applySort($query, $sort, alphaTable: 'topic_revision_translations', alphaForeignKey: 'topic_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Topic
    {
        return PublicIdentifier::constrain(Topic::query()->published(), $identifier)
            ->with([
                'publishedTranslations',
                'parent' => static fn ($query) => $query->published(),
                'parent.publishedTranslations',
                'children' => static fn ($query) => $query->published(),
                'children.publishedTranslations',
            ])
            ->first();
    }

    public function findBySlug(string $slug): ?Topic
    {
        return $this->findByIdentifier($slug);
    }
}
