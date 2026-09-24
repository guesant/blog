<?php

namespace App\ReadModel\PublicSite\Chrome;

use App\Application\PublicSite\GetPublicSiteChromeQuery;
use App\Application\PublicSite\GetPublicSiteChromeQueryResult;
use App\Application\PublicSite\Ports\PublicSiteChromeReader;

final class PublicSiteChromeSqlReader implements PublicSiteChromeReader
{
    public function __construct(
        private readonly PublicSiteSettingsReader $settings,
        private readonly PublicSiteProfileReader $profile,
        private readonly PublicNavigationReader $navigation,
        private readonly PublicSiteAvailabilityReader $availability,
    ) {}

    public function read(GetPublicSiteChromeQuery $query): GetPublicSiteChromeQueryResult
    {
        $settings = $this->settings->read($query->locale);
        $profile = $this->profile->read($query->locale);
        $profileName = $profile['name'] ?? null;
        $copyright = $this->copyright($settings['copyright_template'], $profileName, $settings['short_name']);

        return new GetPublicSiteChromeQueryResult(
            site: [
                'short_name' => $settings['short_name'],
                'portfolio_url' => $settings['portfolio_url'],
                'source_repository_url' => $settings['source_repository_url'],
                'contact_available' => $settings['contact_available'],
                'contact_profiles' => $settings['contact_profiles'],
                'protected_email' => null,
                'maintenance_enabled' => $settings['maintenance_enabled'],
                'maintenance_eyebrow' => $settings['maintenance_eyebrow'],
                'maintenance_title' => $settings['maintenance_title'],
                'maintenance_description' => $settings['maintenance_description'],
                'seo' => $settings['seo'],
            ],
            profile: $profile,
            copyright: $copyright,
            navigation: $this->navigation->read($query->locale),
            build: [
                'commit_sha' => config('app.commit_sha'),
                'build_time' => config('app.build_time'),
            ],
            visibility: $this->availability->read(
                $query->locale,
                $profile !== null,
                $settings['contact_available'],
            ),
        );
    }

    private function copyright(?string $template, ?string $profileName, ?string $shortName): string
    {
        if ($template === null || $template === '') {
            return 'Portfolio';
        }

        return str_replace(
            ['{year}', '{name}'],
            [(string) now()->year, $profileName ?? $shortName ?? ''],
            $template,
        );
    }
}
