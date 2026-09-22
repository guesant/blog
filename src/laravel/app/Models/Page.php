<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method PageTranslation|null translation(?string $locale = null)
 */
class Page extends Model
{
    use Auditable, HasFactory, HasTranslations {
        translation as legacyTranslation;
    }

    protected $fillable = ['slug'];

    /**
     * @return HasMany<PageTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(PageTranslation::class);
    }

    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(PageRevision::class, 'current_revision_id');
    }

    public function translation(?string $locale = null): PageRevisionTranslation|PageTranslation|null
    {
        if (! $this->relationLoaded('currentRevision')) {
            $this->load('currentRevision.translations');
        }

        return $this->currentRevision?->translation($locale) ?? $this->legacyTranslation($locale);
    }

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
