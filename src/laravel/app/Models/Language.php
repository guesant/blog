<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method LanguageTranslation|null translation(?string $locale = null)
 */
class Language extends Model
{
    use Auditable, HasFactory, HasTranslations, UsesCurrentRevision {
        UsesCurrentRevision::translation insteadof HasTranslations;
        HasTranslations::translation as legacyTranslation;
    }

    protected $fillable = ['slug', 'order', 'code'];

    /**
     * @return HasMany<LanguageTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(LanguageTranslation::class);
    }

    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(LanguageRevision::class, 'current_revision_id');
    }

    /**
     * @return HasMany<resource, $this>
     */
    public function resources(): HasMany
    {
        return $this->hasMany(Resource::class);
    }

    /**
     * @return HasMany<ResourceLink, $this>
     */
    public function resourceLinks(): HasMany
    {
        return $this->hasMany(ResourceLink::class);
    }

    /**
     * @return HasMany<ResumeLanguage, $this>
     */
    public function resumeLanguages(): HasMany
    {
        return $this->hasMany(ResumeLanguage::class);
    }
}
