<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\Resource;
use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TopicQuery
{
    use SortsListings;

    public function list(): Collection
    {
        return Topic::where('hidden', false)
            ->orderBy('order')
            ->orderBy('id')
            ->with('translations')
            ->get();
    }

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Topic::where('hidden', false)
            ->with(['translations', 'children.translations']);

        $this->applySort($query, $sort, alphaTable: 'topic_translations', alphaForeignKey: 'topic_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Topic
    {
        return Topic::where('slug', $slug)
            ->where('hidden', false)
            ->with(['translations', 'children.translations'])
            ->first();
    }

    /**
     * Mixed content hub for a topic: non-hidden writings and public findings
     * carrying it, grouped by kind. No pagination — volumes are small.
     */
    public function contentFor(Topic $topic): array
    {
        $writings = Writing::where('hidden', false)
            ->whereHas('topics', fn ($t) => $t->where('topics.id', $topic->id))
            ->orderBy('date_iso', 'desc')
            ->with(['translations'])
            ->get();

        $findings = Resource::public()
            ->whereHas('topics', fn ($t) => $t->where('topics.id', $topic->id))
            ->orderBy('order')
            ->with(['translations', 'topics.translations'])
            ->get();

        return [
            'writings' => $writings,
            'findings' => $findings,
        ];
    }
}
