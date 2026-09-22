<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method ProfileTranslation|null translation(?string $locale = null)
 */
class Profile extends Model
{
    use HasFactory, HasTranslations {
        translation as legacyTranslation;
    }

    protected $fillable = ['name', 'birth_date'];

    protected $casts = ['birth_date' => 'date'];

    /**
     * @return HasMany<ProfileTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ProfileTranslation::class);
    }

    public function currentRevision(): BelongsTo
    {
        return $this->belongsTo(ProfileRevision::class, 'current_revision_id');
    }

    public function translation(?string $locale = null): ProfileRevisionTranslation|ProfileTranslation|null
    {
        if (! $this->relationLoaded('currentRevision')) {
            $this->load('currentRevision.translations');
        }

        return $this->currentRevision?->translation($locale) ?? $this->legacyTranslation($locale);
    }
}
