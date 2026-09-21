<?php

namespace App\Content;

use App\Content\Concerns\SortsListings;
use App\Models\CaseStudy;
use App\Models\Experiment;
use App\Models\Project;
use App\Models\ResumeSkill;
use App\Models\Technology;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TechnologyQuery
{
    use SortsListings;

    public function listPaginated(int $perPage = 20, ?string $sort = 'order'): LengthAwarePaginator
    {
        $query = Technology::where('hidden', false)
            ->with(['translations', 'resumeSkills.topic.translations']);

        $this->applySort($query, $sort, alphaTable: 'technology_translations', alphaForeignKey: 'technology_id', alphaColumn: 'name');

        return $query->paginate($perPage);
    }

    public function findBySlug(string $slug): ?Technology
    {
        return Technology::where('slug', $slug)
            ->where('hidden', false)
            ->with(['translations', 'resumeSkills.topic.translations'])
            ->first();
    }

    /**
     * Mixed content hub for a technology: non-hidden case studies, projects
     * and experiments carrying it, plus resume skill groups, grouped by kind.
     */
    public function contentFor(Technology $technology, string $locale): array
    {
        $caseStudies = CaseStudy::where('hidden', false)
            ->whereHas('technologies', fn ($t) => $t->where('technologies.id', $technology->id))
            ->orderBy('published_at', 'desc')
            ->with('translations')
            ->get();

        $projects = Project::where('hidden', false)
            ->whereHas('technologies', fn ($t) => $t->where('technologies.id', $technology->id))
            ->orderBy('published_at', 'desc')
            ->with('translations')
            ->get();

        $experiments = Experiment::where('hidden', false)
            ->whereHas('technologies', fn ($t) => $t->where('technologies.id', $technology->id))
            ->orderBy('published_at', 'desc')
            ->with('translations')
            ->get();

        $resumeSkills = ResumeSkill::whereHas('technologies', fn ($t) => $t->where('technologies.id', $technology->id))
            ->with('topic.translations')
            ->get();

        return [
            'caseStudies' => $caseStudies,
            'projects' => $projects,
            'experiments' => $experiments,
            'resumeSkills' => $resumeSkills,
        ];
    }
}
