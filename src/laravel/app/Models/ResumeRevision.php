<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResumeRevision extends Model
{
    protected $table = 'resume_revisions';

    protected $guarded = [];

    protected $casts = ['hidden' => 'boolean'];

    public function resume(): BelongsTo
    {
        return $this->belongsTo(Resume::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ResumeRevisionTranslation::class);
    }

    public function translation(?string $locale = null): ?ResumeRevisionTranslation
    {
        $normalized = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $normalized)
            ?? $this->translations->firstWhere('locale', 'en');
    }

    public function selectedCases(): BelongsToMany
    {
        return $this->belongsToMany(CaseStudy::class, 'resume_revision_selected_cases', 'resume_revision_id', 'case_study_id')
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }
}
