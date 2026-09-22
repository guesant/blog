<?php

namespace App\Application\PublicSite;

use App\Content\SiteSettingsQuery;

final class IsPublicSiteInMaintenanceHandler
{
    public function __construct(
        private readonly SiteSettingsQuery $settings,
    ) {}

    public function handle(IsPublicSiteInMaintenance $query): bool
    {
        return (bool) $this->settings->find()?->maintenance_enabled;
    }
}
