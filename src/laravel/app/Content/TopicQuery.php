<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\Topic;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TopicQuery
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Topic::where('hidden', false)
            ->with(['translations', 'parent.translations', 'children.translations']);

        $this->applySort($query, $sort, alphaTable: 'topic_translations', alphaForeignKey: 'topic_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Topic
    {
        return Topic::where('slug', $slug)
            ->where('hidden', false)
            ->with(['translations', 'parent.translations', 'children.translations'])
            ->first();
    }
}
