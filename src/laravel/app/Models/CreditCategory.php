<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CreditCategory extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'order', 'active'];

    protected $casts = ['active' => 'boolean'];

    /**
     * @return HasMany<CreditCategoryTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(CreditCategoryTranslation::class);
    }

    public function translation(?string $locale = null): ?CreditCategoryTranslation
    {
        $locale = Locale::normalize($locale);
        $translations = $this->relationLoaded('translations')
            ? $this->translations
            : $this->translations()->get();

        return $translations->firstWhere('locale', $locale)
            ?? $translations->firstWhere('locale', 'en');
    }
}
