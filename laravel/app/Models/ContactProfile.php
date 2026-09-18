<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactProfile extends Model
{
    use HasFactory;

    protected $fillable = ['site_settings_id', 'platform', 'label', 'url', 'order'];

    /**
     * @return BelongsTo<SiteSettings, $this>
     */
    public function siteSettings(): BelongsTo
    {
        return $this->belongsTo(SiteSettings::class);
    }
}
