<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Content\PublicIdentifier;
use App\Models\Topic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TopicReader
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Topic::where('topics.hidden', false)
            ->with(['translations', 'parent.translations', 'children.translations']);

        $this->applySort($query, $sort, alphaTable: 'topic_revision_translations', alphaForeignKey: 'topic_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Topic
    {
        return PublicIdentifier::constrain(Topic::query(), $identifier)
            ->where('hidden', false)
            ->with(['translations', 'parent.translations', 'children.translations'])
            ->first();
    }

    public function findBySlug(string $slug): ?Topic
    {
        return $this->findByIdentifier($slug);
    }
}
