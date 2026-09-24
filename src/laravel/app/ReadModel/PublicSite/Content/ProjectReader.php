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

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Project::where('projects.hidden', false)
            ->where('projects.nda', false)
            ->with(['translations', 'technologies.translations']);

        $this->applySort($query, $sort, alphaTable: 'project_revision_translations', alphaForeignKey: 'project_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findByIdentifier(string $identifier): ?Project
    {
        return PublicIdentifier::constrain(Project::query(), $identifier)
            ->where('hidden', false)
            ->where('nda', false)
            ->with(['translations', 'technologies.translations'])
            ->first();
    }

    public function findBySlug(string $slug): ?Project
    {
        return $this->findByIdentifier($slug);
    }

    public function listExperimentsPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Experiment::where('experiments.hidden', false)
            ->with(['translations', 'technologies.translations']);

        $this->applySort($query, $sort, alphaTable: 'experiment_revision_translations', alphaForeignKey: 'experiment_revision_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findExperimentByIdentifier(string $identifier): ?Experiment
    {
        return PublicIdentifier::constrain(Experiment::query(), $identifier)
            ->where('hidden', false)
            ->with(['translations', 'technologies.translations'])
            ->first();
    }

    public function findExperimentBySlug(string $slug): ?Experiment
    {
        return $this->findExperimentByIdentifier($slug);
    }

    public function related(Project $project, int $limit = 3): Collection
    {
        $baseQuery = Project::where('id', '!=', $project->id)
            ->where('hidden', false)
            ->where('nda', false);

        return $this->relatedByTechnology($baseQuery, $project->technologies->pluck('id'), $limit, ['translations', 'technologies.translations']);
    }

    public function relatedExperiments(Experiment $experiment, int $limit = 3): Collection
    {
        $baseQuery = Experiment::where('id', '!=', $experiment->id)
            ->where('hidden', false);

        return $this->relatedByTechnology($baseQuery, $experiment->technologies->pluck('id'), $limit, ['translations', 'technologies.translations']);
    }
}
