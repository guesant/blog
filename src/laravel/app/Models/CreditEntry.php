<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method CreditEntryTranslation|null translation(?string $locale = null)
 */
class CreditEntry extends Model
{
    use Auditable, HasFactory, HasTranslations, UsesCurrentRevision {
        UsesCurrentRevision::translation insteadof HasTranslations;
        HasTranslations::translation as legacyTranslation;
    }

    protected $fillable = [
        'url', 'category', 'order',
        'is_automatic', 'active', 'package_manager', 'package_name',
    ];

    protected $casts = [
        'is_automatic' => 'boolean',
        'active' => 'boolean',
    ];

    /**
     * @return HasMany<CreditEntryTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(CreditEntryTranslation::class);
    }
}
