<?php

namespace App\Support;

use App\Models\Profile;
use App\Models\SiteSettings;

class PersonSchema
{
    public static function build(?Profile $profile, ?SiteSettings $siteSettings, string $url, array $extra = []): ?array
    {
        if ($siteSettings?->maintenance_enabled) {
            return null;
        }

        return array_merge([
            '@context' => 'https://schema.org',
            '@type' => 'Person',
            'name' => $profile?->name,
            'url' => $url,
        ], $extra, [
            'sameAs' => $siteSettings?->contactProfiles->pluck('url')->values()->all() ?? [],
        ]);
    }
}
