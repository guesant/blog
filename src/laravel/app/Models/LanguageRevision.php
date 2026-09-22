<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LanguageRevision extends Model
{
    protected $table = 'language_revisions';

    protected $guarded = [];

    public function translations(): HasMany
    {
        return $this->hasMany(LanguageRevisionTranslation::class);
    }

    public function translation(?string $locale = null): ?LanguageRevisionTranslation
    {
        $normalized = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $normalized)
            ?? $this->translations->firstWhere('locale', 'en');
    }
}
