<?php

namespace App\Content;

use App\Models\Writing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class WritingQuery
{
    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Writing::where('hidden', false)
            ->with(['translations', 'topics.translations']);

        if ($sort === 'asc') {
            $query->orderBy('created_at', 'asc')->orderBy('id');
        } elseif ($sort === 'desc') {
            $query->orderBy('created_at', 'desc')->orderBy('id');
        } else {
            $query->orderBy('date_iso', 'desc')->orderBy('id');
        }

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Writing
    {
        return Writing::where('slug', $slug)
            ->where('hidden', false)
            ->with(['translations', 'topics.translations'])
            ->first();
    }

    public function related(Writing $writing, int $limit = 3): Collection
    {
        $topic = $writing->topics->first();

        if (! $topic) {
            return collect();
        }

        return Writing::where('id', '!=', $writing->id)
            ->where('hidden', false)
            ->whereHas('topics', fn ($t) => $t->where('topics.id', $topic->id))
            ->orderBy('date_iso', 'desc')
            ->limit($limit)
            ->with(['translations'])
            ->get();
    }
}
