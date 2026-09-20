<?php

namespace App\Content;

use App\Models\SiteSettings;

class SiteSettingsQuery
{
    public function find(): ?SiteSettings
    {
        return SiteSettings::with(['translations', 'contactProfiles'])->first();
    }
}
