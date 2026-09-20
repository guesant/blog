<?php

namespace Database\Seeders;

use App\Models\Profile;
use App\Models\Resume;
use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

/**
 * Minimal fixture data for CI to exercise the résumé PDF build
 * (ResumePdfBuilder requires a Profile, Resume and SiteSettings to exist).
 * Not meant to resemble real content — the real content only exists
 * locally via the Fase 2 export/import pipeline, which CI doesn't have.
 */
class CiResumePdfSeeder extends Seeder
{
    public function run(): void
    {
        $profile = Profile::create(['name' => 'CI Test']);
        $profile->translations()->create(['locale' => 'en', 'title' => 'Developer', 'location' => 'Remote']);
        $profile->translations()->create(['locale' => 'pt-BR', 'title' => 'Desenvolvedor', 'location' => 'Remoto']);

        $resume = Resume::create();
        $resume->translations()->create(['locale' => 'en', 'summary' => 'CI test summary.']);
        $resume->translations()->create(['locale' => 'pt-BR', 'summary' => 'Resumo de teste de CI.']);

        $siteSettings = SiteSettings::create([
            'short_name' => 'CI',
            'portfolio_url' => 'https://example.test',
        ]);
        $siteSettings->translations()->create(['locale' => 'en']);
        $siteSettings->translations()->create(['locale' => 'pt-BR']);
    }
}
