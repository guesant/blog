<?php

namespace App\Models;

use App\Content\Graph\GraphNode;
use App\Content\Graph\InteractsWithGraph;
use App\Content\Locale;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @method TechnologyRevisionTranslation|null translation(?string $locale = null)
 */
class Technology extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, InteractsWithGraph, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'order', 'code', 'logo', 'hidden'];

    protected $casts = ['hidden' => 'boolean'];

    /**
     * @return BelongsToMany<CaseStudy, $this>
     */
    public function caseStudies(): BelongsToMany
    {
        return $this->belongsToMany(CaseStudy::class, 'case_study_technology');
    }

    /**
     * @return BelongsToMany<Project, $this>
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_technology');
    }

    /**
     * @return BelongsToMany<Experiment, $this>
     */
    public function experiments(): BelongsToMany
    {
        return $this->belongsToMany(Experiment::class, 'experiment_technology');
    }

    /**
     * @return BelongsToMany<ResumeSkill, $this>
     */
    public function resumeSkills(): BelongsToMany
    {
        return $this->belongsToMany(ResumeSkill::class, 'resume_skill_technology');
    }

    public static function graphKind(): string
    {
        return 'technology';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->name ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url("/technologies/{$this->slug}", $locale);
    }
}
