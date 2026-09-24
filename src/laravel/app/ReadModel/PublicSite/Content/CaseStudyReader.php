<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\RelatesByTechnology;
use App\Content\Concerns\SortsListings;
use App\Content\PublicIdentifier;
use App\Models\CaseStudy;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class CaseStudyReader
{
    use RelatesByTechnology, SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = CaseStudy::where('case_studies.hidden', false)
            ->where('case_studies.nda', false)
            ->with(['translations', 'technologies.translations']);

        $this->applySort($query, $sort, alphaTable: 'case_study_revision_translations', alphaForeignKey: 'case_study_revision_id', alphaColumn: 'title');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?CaseStudy
    {
        return PublicIdentifier::constrain(CaseStudy::query(), $identifier)
            ->where('hidden', false)
            ->where('nda', false)
            ->with(['translations', 'technologies.translations'])
            ->first();
    }

    public function findBySlug(string $slug): ?CaseStudy
    {
        return $this->findByIdentifier($slug);
    }

    public function related(CaseStudy $case, int $limit = 3): Collection
    {
        $baseQuery = CaseStudy::where('id', '!=', $case->id)
            ->where('hidden', false)
            ->where('nda', false);

        return $this->relatedByTechnology($baseQuery, $case->technologies->pluck('id'), $limit, ['translations', 'technologies.translations']);
    }
}
