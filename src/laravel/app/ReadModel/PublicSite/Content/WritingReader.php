<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Locale;
use App\Content\PublicIdentifier;
use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class WritingReader
{
    public function listPaginated(
        int $perPage = 50,
        ?string $sort = null,
        ?string $locale = null,
        ?string $search = null,
        ?string $topic = null,
    ): LengthAwarePaginator {
        $query = Writing::query()
            ->published()
            ->with([
                'publishedTranslations',
                'topics' => static fn ($query) => $query->published(),
                'topics.publishedTranslations',
            ]);

        if (filled($search)) {
            $term = '%'.$search.'%';
            $query->whereHas('publishedTranslations', function ($translation) use ($locale, $term): void {
                $translation->where('locale', Locale::normalize($locale))
                    ->where(function ($fields) use ($term): void {
                        $fields->where('title', 'ilike', $term)
                            ->orWhere('excerpt', 'ilike', $term);
                    });
            });
        }

        if (filled($topic)) {
            $query->whereHas('topics', fn (Builder $topicQuery) => $topicQuery
                ->whereIn('topics.id', Topic::query()->published()->select('id'))
                ->where('topics.slug', $topic));
        }

        if ($sort === 'asc') {
            $query->orderBy('created_at', 'asc')->orderBy('id');
        } elseif ($sort === 'desc') {
            $query->orderBy('created_at', 'desc')->orderBy('id');
        } else {
            $query->orderBy('date_iso', 'desc')->orderBy('id');
        }

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Writing
    {
        return PublicIdentifier::constrain(Writing::query()->published(), $identifier)
            ->with([
                'publishedTranslations',
                'topics' => static fn ($query) => $query->published(),
                'topics.publishedTranslations',
            ])
            ->first();
    }

    public function findBySlug(string $slug): ?Writing
    {
        return $this->findByIdentifier($slug);
    }

    public function related(Writing $writing, int $limit = 3): Collection
    {
        $topic = $writing->topics->first();

        if (! $topic) {
            return collect();
        }

        return Writing::query()
            ->published()
            ->where('id', '!=', $writing->id)
            ->whereHas('topics', fn (Builder $t) => $t
                ->whereIn('topics.id', Topic::query()->published()->select('id'))
                ->where('topics.id', $topic->id))
            ->orderBy('date_iso', 'desc')
            ->limit($limit)
            ->with(['publishedTranslations', 'topics.publishedTranslations'])
            ->get();
    }
}
