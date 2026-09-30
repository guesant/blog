<?php

namespace App\ReadModel\PublicSite\Content;

use App\Models\SiteSettings;

class SiteSettingsReader
{
    public function find(): ?SiteSettings
    {
        return SiteSettings::query()
            ->published()
            ->with(['publishedTranslations', 'contactProfiles.platform'])
            ->first();
    }
}
