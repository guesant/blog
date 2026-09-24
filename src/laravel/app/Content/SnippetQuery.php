<?php

namespace App\Content;

use App\Application\PublicSite\PublicSnippetReader;
use App\Content\Concerns\SortsListings;
use App\Models\Snippet;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class SnippetQuery implements PublicSnippetReader
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Snippet::where('hidden', false)
            ->withCount('files')
            ->with('translations');

        $this->applySort($query, $sort, alphaTable: 'snippet_revision_translations', alphaForeignKey: 'snippet_revision_id', alphaColumn: 'title');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Snippet
    {
        return PublicIdentifier::constrain(Snippet::query(), $identifier)
            ->where('hidden', false)
            ->with(['translations', 'files'])
            ->first();
    }

    public function findBySlug(string $slug): ?Snippet
    {
        return $this->findByIdentifier($slug);
    }

    public function findForDownload(string $identifier): mixed
    {
        return PublicIdentifier::constrain(Snippet::query(), $identifier)
            ->where('hidden', false)
            ->with('files')
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
