<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method ProfileTranslation|null translation(?string $locale = null)
 */
class Profile extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = ['name', 'birth_date'];

    protected $casts = ['birth_date' => 'date'];

    /**
     * @return HasMany<ProfileTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ProfileTranslation::class);
    }
}
