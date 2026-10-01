<?php

namespace App\ReadModel\PublicSite\Content;

use App\Content\Concerns\RelatesByTechnology;
use App\Content\Concerns\SortsListings;
use App\Content\PublicIdentifier;
use App\Models\Experiment;
use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProjectReader
{
    use RelatesByTechnology, SortsListings;

    public function listPaginated(int $perPage = 50, ?string $sort = null): LengthAwarePaginator
    {
        $query = Project::query()
            ->published()
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false))
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ]);

        $this->applySort($query, $sort, alphaTable: 'project_revision_translations', alphaForeignKey: 'project_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Project
    {
        return PublicIdentifier::constrain(Project::query()->published(), $identifier)
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false))
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ])
            ->first();
    }

    public function findBySlug(string $slug): ?Project
    {
        return $this->findByIdentifier($slug);
    }

    public function listExperimentsPaginated(int $perPage = 50, ?string $sort = null): LengthAwarePaginator
    {
        $query = Experiment::query()
            ->published()
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ]);

        $this->applySort($query, $sort, alphaTable: 'experiment_revision_translations', alphaForeignKey: 'experiment_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findExperimentByIdentifier(string $identifier): ?Experiment
    {
        return PublicIdentifier::constrain(Experiment::query()->published(), $identifier)
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ])
            ->first();
    }

    public function findExperimentBySlug(string $slug): ?Experiment
    {
        return $this->findExperimentByIdentifier($slug);
    }

    public function related(Project $project, int $limit = 3): Collection
    {
        $baseQuery = Project::query()
            ->published()
            ->where('id', '!=', $project->id)
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false));

        return $this->relatedByTechnology($baseQuery, $project->technologies->pluck('id'), $limit, [
            'publishedTranslations',
            'technologies' => static fn ($query) => $query->published(),
            'technologies.publishedTranslations',
        ]);
    }

    public function relatedExperiments(Experiment $experiment, int $limit = 3): Collection
    {
        $baseQuery = Experiment::query()
            ->published()
            ->where('id', '!=', $experiment->id);

        return $this->relatedByTechnology($baseQuery, $experiment->technologies->pluck('id'), $limit, [
            'publishedTranslations',
            'technologies' => static fn ($query) => $query->published(),
            'technologies.publishedTranslations',
        ]);
    }
}
