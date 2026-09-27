<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RelationType extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'family', 'symmetric'];

    /**
     * @return HasMany<RelationTypeTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(RelationTypeTranslation::class);
    }

    public function translation(?string $locale = null): ?RelationTypeTranslation
    {
        $locale = Locale::normalize($locale);
        $translations = $this->relationLoaded('translations')
            ? $this->translations
            : $this->translations()->get();

        return $translations->firstWhere('locale', $locale)
            ?? $translations->firstWhere('locale', 'en');
    }

    /**
     * @return HasMany<ContentRelation, $this>
     */
    public function contentRelations(): HasMany
    {
        return $this->hasMany(ContentRelation::class);
    }
}
