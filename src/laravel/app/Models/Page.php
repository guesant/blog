<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @method PageRevisionTranslation|null translation(?string $locale = null)
 */
class Page extends Model
{
    use Auditable, HasFactory, UsesCurrentRevision;

    protected $fillable = ['slug'];

    /**
     * @return BelongsToMany<CaseStudy, $this>
     */
    public function featuredCases(): BelongsToMany
    {
        return $this->belongsToMany(CaseStudy::class, 'page_featured_case')->withPivot('order');
    }

    /**
     * @return BelongsToMany<Project, $this>
     */
    public function featuredProjects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'page_featured_project')->withPivot('order');
    }

    /**
     * @return BelongsToMany<Writing, $this>
     */
    public function featuredWritings(): BelongsToMany
    {
        return $this->belongsToMany(Writing::class, 'page_featured_writing')->withPivot('order');
    }
}
