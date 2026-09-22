<?php

namespace App\Models;

use App\Content\Locale;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProfileRevision extends Model
{
    protected $table = 'profile_revisions';

    protected $guarded = [];

    protected $casts = ['birth_date' => 'date', 'hidden' => 'boolean'];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ProfileRevisionTranslation::class);
    }

    public function translation(?string $locale = null): ?ProfileRevisionTranslation
    {
        $normalized = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $normalized)
            ?? $this->translations->firstWhere('locale', 'en');
    }
}
