<?php

namespace App\Content;

use App\Support\ProtectedEmail;
use Illuminate\Support\Facades\Cache;

class SiteChromeQuery
{
    /**
     * Dados de chrome compartilhados entre todas as páginas do design
     * minimalista (sidebar + rodapé): perfil, configurações do site,
     * desafio de e-mail protegido e informações de build/copyright.
     */
    public function build(string $locale): array
    {
        $siteSettings = (new SiteSettingsQuery)->find();
        $headerProfile = (new ProfileQuery)->find();

        $emailChallenge = $siteSettings?->contact_email
            ? Cache::remember(
                'protected-email-challenge:v2:'.md5($siteSettings->contact_email),
                now()->addDay(),
                fn () => ProtectedEmail::encode($siteSettings->contact_email),
            )
            : null;

        $copyrightTemplate = $siteSettings?->translation($locale)?->copyright_template;
        $copyright = $copyrightTemplate
            ? str_replace(
                ['{year}', '{name}'],
                [(string) now()->year, $headerProfile->name ?? $siteSettings->short_name ?? ''],
                $copyrightTemplate,
            )
            : 'Portfolio';

        $copyright = str_ireplace(
            ['Some rights reserved', 'Alguns direitos reservados'],
            ['Some rights reserved', 'Alguns direitos reservados'],
            $copyright,
        );

        return [
            'siteSettings' => $siteSettings,
            'headerProfile' => $headerProfile,
            'emailChallenge' => $emailChallenge,
            'copyright' => $copyright,
            'sourceRepositoryUrl' => $siteSettings?->source_repository_url,
            'commitSha' => config('app.commit_sha'),
            'buildTime' => config('app.build_time'),
        ];
    }
}
