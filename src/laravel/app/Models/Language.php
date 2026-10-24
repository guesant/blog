<?php

namespace App\Models;

use App\Models\Concerns\AssignsNextOrder;
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
    use AssignsNextOrder, Auditable, HasFactory, UsesCurrentRevision;

    protected $fillable = ['slug', 'order', 'code'];

    /**
     * @return HasMany<ResumeLanguage, $this>
     */
    public function resumeLanguages(): HasMany
    {
        return $this->hasMany(ResumeLanguage::class);
    }
}
