<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\Snippet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SnippetQuery
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Snippet::where('hidden', false)
            ->withCount('files')
            ->with('translations');

        $this->applySort($query, $sort, alphaTable: 'snippet_translations', alphaForeignKey: 'snippet_id', alphaColumn: 'title');

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Snippet
    {
        return Snippet::where('slug', $slug)
            ->where('hidden', false)
            ->with(['translations', 'files'])
            ->first();
    }

    /**
     * Snippet has no category/tags to group by, so relatedness falls back to
     * recency: the most recently published other snippets.
     */
    public function related(Snippet $snippet, int $limit = 3): Collection
    {
        return Snippet::where('id', '!=', $snippet->id)
            ->where('hidden', false)
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->with('translations')
            ->get();
    }
}
