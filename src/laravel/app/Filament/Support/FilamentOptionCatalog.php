<?php

namespace App\Filament\Support;

final class FilamentOptionCatalog
{
    public const PLATFORMS = [
        'github' => 'GitHub',
        'gitlab' => 'GitLab',
        'linkedin' => 'LinkedIn',
        'lattes' => 'Lattes',
        'orcid' => 'ORCID',
        'scholar' => 'Google Scholar',
        'researchgate' => 'ResearchGate',
        'mastodon' => 'Mastodon',
        'bluesky' => 'Bluesky',
        'youtube' => 'YouTube',
        'website' => 'Website',
    ];

    public const PROFICIENCIES = [
        'native' => 'Native',
        'A1' => 'A1',
        'A2' => 'A2',
        'B1' => 'B1',
        'B2' => 'B2',
        'C1' => 'C1',
        'C2' => 'C2',
    ];

    public const TECHNICAL_PRODUCTION_KINDS = [
        'software' => 'Software',
        'library' => 'Library',
        'tool' => 'Tool',
        'dataset' => 'Dataset',
    ];
}
