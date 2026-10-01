<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Content\PublicIdentifier;
use App\Models\Technology;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TechnologyReader
{
    use SortsListings;

    public function listPaginated(int $perPage = 50, ?string $sort = 'order'): LengthAwarePaginator
    {
        $query = Technology::query()
            ->published()
            ->with([
                'publishedTranslations',
                'resumeSkills.topic' => static fn ($query) => $query->published(),
                'resumeSkills.topic.publishedTranslations',
                'resumeSkills.topic.parent' => static fn ($query) => $query->published(),
                'resumeSkills.topic.parent.publishedTranslations',
            ]);

        $this->applySort($query, $sort, alphaTable: 'technology_revision_translations', alphaForeignKey: 'technology_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Technology
    {
        return PublicIdentifier::constrain(Technology::query()->published(), $identifier)
            ->with([
                'publishedTranslations',
                'resumeSkills.topic' => static fn ($query) => $query->published(),
                'resumeSkills.topic.publishedTranslations',
                'resumeSkills.topic.parent' => static fn ($query) => $query->published(),
                'resumeSkills.topic.parent.publishedTranslations',
            ])
            ->first();
    }

    public function findBySlug(string $slug): ?Technology
    {
        return $this->findByIdentifier($slug);
    }
}
