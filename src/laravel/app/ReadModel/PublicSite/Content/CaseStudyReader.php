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

    public function listPaginated(int $perPage = 50, ?string $sort = null): LengthAwarePaginator
    {
        $query = CaseStudy::query()
            ->published()
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false))
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ]);

        $this->applySort($query, $sort, alphaTable: 'case_study_revision_translations', alphaForeignKey: 'case_study_revision_id', alphaColumn: 'title');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?CaseStudy
    {
        return PublicIdentifier::constrain(CaseStudy::query()->published(), $identifier)
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false))
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ])
            ->first();
    }

    public function findBySlug(string $slug): ?CaseStudy
    {
        return $this->findByIdentifier($slug);
    }

    public function related(CaseStudy $case, int $limit = 3): Collection
    {
        $baseQuery = CaseStudy::query()
            ->published()
            ->where('id', '!=', $case->id)
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false));

        return $this->relatedByTechnology($baseQuery, $case->technologies->pluck('id'), $limit, [
            'publishedTranslations',
            'technologies' => static fn ($query) => $query->published(),
            'technologies.publishedTranslations',
        ]);
    }
}
