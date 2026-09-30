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

    protected $fillable = ['short_name', 'portfolio_url', 'maintenance_enabled', 'contact_email', 'contact_enabled', 'contact_available', 'source_repository_url', 'content_actions_copy_text', 'content_actions_copy_url', 'content_actions_download_text', 'contextual_cursor_enabled', 'feed_flat_cards_enabled'];

    protected $casts = ['maintenance_enabled' => 'boolean', 'contact_enabled' => 'boolean', 'contact_available' => 'boolean', 'content_actions_copy_text' => 'boolean', 'content_actions_copy_url' => 'boolean', 'content_actions_download_text' => 'boolean', 'contextual_cursor_enabled' => 'boolean', 'feed_flat_cards_enabled' => 'boolean'];

    /**
     * @return HasMany<ContactProfile, $this>
     */
    public function contactProfiles(): HasMany
    {
        return $this->hasMany(ContactProfile::class);
    }
}
