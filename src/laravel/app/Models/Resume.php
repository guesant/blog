<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method ResumeTranslation|null translation(?string $locale = null)
 */
class Resume extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [];

    /**
     * @return HasMany<ResumeTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ResumeTranslation::class);
    }

    /**
     * @return BelongsToMany<CaseStudy, $this>
     */
    public function selectedCases(): BelongsToMany
    {
        return $this->belongsToMany(CaseStudy::class, 'resume_selected_case')->withPivot('order');
    }

    /**
     * @return HasMany<ResumeSkill, $this>
     */
    public function skills(): HasMany
    {
        return $this->hasMany(ResumeSkill::class);
    }

    /**
     * @return HasMany<ResumeLanguage, $this>
     */
    public function languages(): HasMany
    {
        return $this->hasMany(ResumeLanguage::class);
    }
}
