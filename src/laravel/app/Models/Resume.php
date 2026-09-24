<?php

namespace App\Models;

use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method ResumeRevisionTranslation|null translation(?string $locale = null)
 */
class Resume extends Model
{
    use HasFactory, UsesCurrentRevision;

    protected $fillable = [];

    /**
     * @return BelongsToMany<CaseStudy, $this>
     */
    public function selectedCases(): BelongsToMany
    {
        return $this->belongsToMany(CaseStudy::class, 'resume_selected_case')
            ->withPivot('order')
            ->orderByPivot('order');
    }

    /**
     * @return HasMany<ResumeSkill, $this>
     */
    public function skills(): HasMany
    {
        return $this->hasMany(ResumeSkill::class)->orderBy('order');
    }

    /**
     * @return HasMany<ResumeLanguage, $this>
     */
    public function languages(): HasMany
    {
        return $this->hasMany(ResumeLanguage::class)->orderBy('order');
    }
}
