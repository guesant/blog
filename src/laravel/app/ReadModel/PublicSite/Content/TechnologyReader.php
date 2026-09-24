<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\SortsListings;
use App\Content\PublicIdentifier;
use App\Models\Technology;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TechnologyReader
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = 'order'): LengthAwarePaginator
    {
        $query = Technology::where('technologies.hidden', false)
            ->with(['translations', 'resumeSkills.topic.translations', 'resumeSkills.topic.parent']);

        $this->applySort($query, $sort, alphaTable: 'technology_revision_translations', alphaForeignKey: 'technology_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Technology
    {
        return PublicIdentifier::constrain(Technology::query(), $identifier)
            ->where('hidden', false)
            ->with(['translations', 'resumeSkills.topic.translations', 'resumeSkills.topic.parent'])
            ->first();
    }

    public function findBySlug(string $slug): ?Technology
    {
        return $this->findByIdentifier($slug);
    }
}
