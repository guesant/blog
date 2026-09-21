<?php

namespace App\Content;

use App\Content\Concerns\RelatesByTechnology;
use App\Content\Concerns\SortsListings;
use App\Models\Experiment;
use App\Models\Project;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ProjectQuery
{
    use RelatesByTechnology, SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Project::where('hidden', false)
            ->where('nda', false)
            ->with(['translations', 'technologies.translations']);

        $this->applySort($query, $sort, alphaTable: 'project_translations', alphaForeignKey: 'project_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Project
    {
        return Project::where('slug', $slug)
            ->where('hidden', false)
            ->where('nda', false)
            ->with(['translations', 'technologies.translations'])
            ->first();
    }

    public function listExperimentsPaginated(int $perPage = 20, ?string $sort = null): LengthAwarePaginator
    {
        $query = Experiment::where('hidden', false)
            ->with(['translations', 'technologies.translations']);

        $this->applySort($query, $sort, alphaTable: 'experiment_translations', alphaForeignKey: 'experiment_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findExperimentBySlug(string $slug): ?Experiment
    {
        return Experiment::where('slug', $slug)
            ->where('hidden', false)
            ->with(['translations', 'technologies.translations'])
            ->first();
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
