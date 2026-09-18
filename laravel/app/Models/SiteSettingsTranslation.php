<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteSettingsTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['site_settings_id', 'locale', 'copyright_template', 'maintenance_eyebrow', 'maintenance_title', 'maintenance_description', 'seo'];

    protected $casts = ['seo' => 'array'];

    /**
     * @return BelongsTo<SiteSettings, $this>
     */
    public function siteSettings(): BelongsTo
    {
        return $this->belongsTo(SiteSettings::class);
    }
}
