<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method LanguageRevisionTranslation|null translation(?string $locale = null)
 */
class Language extends Model
{
    use Auditable, HasFactory, UsesCurrentRevision;

    protected $fillable = ['slug', 'order', 'code'];

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
