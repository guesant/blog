<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\SiteSettingsReader;

final class IsPublicSiteInMaintenanceQueryHandler
{
    public function __construct(
        private readonly SiteSettingsReader $settings,
    ) {}

    public function handle(IsPublicSiteInMaintenanceQuery $query): bool
    {
        return (bool) $this->settings->find()?->maintenance_enabled;
    }
}
