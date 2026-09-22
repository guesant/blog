<?php

namespace App\Models;

use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method SiteSettingsRevisionTranslation|null translation(?string $locale = null)
 */
class SiteSettings extends Model
{
    use HasFactory, UsesCurrentRevision;

    protected $table = 'site_settings';

    protected $fillable = ['short_name', 'portfolio_url', 'maintenance_enabled', 'contact_email', 'contact_available', 'source_repository_url'];

    protected $casts = ['maintenance_enabled' => 'boolean', 'contact_available' => 'boolean'];

    /**
     * @return HasMany<ContactProfile, $this>
     */
    public function contactProfiles(): HasMany
    {
        return $this->hasMany(ContactProfile::class);
    }
}
