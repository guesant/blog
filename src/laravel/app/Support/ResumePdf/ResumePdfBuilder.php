<?php

namespace App\Support\ResumePdf;

use App\Content\PageQuery;
use App\Content\ProfileQuery;
use App\Content\ResumeQuery;
use App\Content\SiteSettingsQuery;
use App\Models\CaseStudy;
use RuntimeException;

class ResumePdfBuilder
{
    private const LOCALES = [
        'en' => [
            'templateFile' => 'en.tex',
            'skillsHeading' => 'Skills',
            'experienceHeading' => 'Experience',
            'leadershipHeading' => 'Leadership Activities',
            'educationHeading' => 'Education',
            'certificatesHeading' => 'Certificates',
            'certificationsHeading' => 'Certifications',
            'publicationsHeading' => 'Publications',
            'technicalProductionsHeading' => 'Technical Productions',
            'eventsHeading' => 'Events',
            'awardsHeading' => 'Awards',
            'languagesHeading' => 'Languages',
            'nativeProficiency' => 'Native',
        ],
        'pt-BR' => [
            'templateFile' => 'pt-BR.tex',
            'skillsHeading' => 'Habilidades',
            'experienceHeading' => 'Experiência',
            'leadershipHeading' => 'Atividades de Liderança',
            'educationHeading' => 'Educação',
            'certificatesHeading' => 'Certificados',
            'certificationsHeading' => 'Certificações',
            'publicationsHeading' => 'Publicações',
            'technicalProductionsHeading' => 'Produções Técnicas',
            'eventsHeading' => 'Eventos',
            'awardsHeading' => 'Prêmios',
            'languagesHeading' => 'Idiomas',
            'nativeProficiency' => 'Nativo',
        ],
    ];

    private const PLATFORM_LABELS = [
        'linkedin' => 'LinkedIn',
        'github' => 'GitHub',
        'lattes' => 'Lattes',
        'orcid' => 'ORCID',
        'scholar' => 'Google Scholar',
        'researchgate' => 'ResearchGate',
        'mastodon' => 'Mastodon',
        'bluesky' => 'Bluesky',
    ];

    private const TECHNICAL_PRODUCTION_KIND_LABELS = [
        'software' => 'Software',
        'library' => 'Library',
        'tool' => 'Tool',
        'dataset' => 'Dataset',
    ];

    public function buildTexSource(string $locale): string
    {
        if (! isset(self::LOCALES[$locale])) {
            throw new RuntimeException("Unsupported résumé locale: {$locale}");
        }

        $localeConfig = self::LOCALES[$locale];

        $profile = (new ProfileQuery)->find();
        $resume = (new ResumeQuery)->find();
        $siteSettings = (new SiteSettingsQuery)->find();
        $page = (new PageQuery)->findBySlug('resume');

        if (! $profile || ! $resume || ! $siteSettings) {
            throw new RuntimeException('Profile, Resume and SiteSettings must all exist before generating the résumé PDF.');
        }

        $profileTranslation = $profile->translation($locale);
        $resumeTranslation = $resume->translation($locale);
        $siteSettingsTranslation = $siteSettings->translation($locale);
        $pageTitle = $page?->translation($locale)?->fields['title'] ?? 'Resume';

        $templatePath = resource_path("pdf/templates/{$localeConfig['templateFile']}");
        $template = file_get_contents($templatePath);

        $replacements = [
            '%%PDF_TITLE%%' => $this->escapeLatex("{$pageTitle} {$profile->name}"),
            '%%PROFILE_NAME%%' => $this->escapeLatex($profile->name),
            '%%PROFILE_LOCATION%%' => $this->escapeLatex($profileTranslation->location ?? ''),
            '%%CONTACT_LINKS%%' => $this->buildContactLinks($siteSettings, $siteSettingsTranslation),
            '%%SUMMARY%%' => $this->escapeLatex($resumeTranslation->summary ?? ''),
            '%%LEADERSHIP_SECTION%%' => $this->buildLeadershipSection($resumeTranslation->leadership ?? [], $localeConfig['leadershipHeading']),
            '%%EXPERIENCE_SECTION%%' => $this->buildOptionalSection(
                $localeConfig['experienceHeading'],
                $this->buildTrajectoryItems(array_filter($profileTranslation->trajectory ?? [], fn ($item) => $item['includeInResume'] ?? false))
            ),
            '%%SELECTED_CASES%%' => $this->buildSelectedCases($resume->selectedCases, $locale),
            '%%SKILLS_SECTION%%' => $this->buildSkillsSection($resume->skills, $locale, $localeConfig['skillsHeading']),
            '%%EDUCATION_SECTION%%' => $this->buildEducationSection($resumeTranslation->education ?? [], $localeConfig['educationHeading']),
            '%%CERTIFICATES_SECTION%%' => $this->buildCredentialsSection($resumeTranslation->certificates ?? [], $localeConfig['certificatesHeading']),
            '%%CERTIFICATIONS_SECTION%%' => $this->buildCredentialsSection($resumeTranslation->certifications ?? [], $localeConfig['certificationsHeading']),
            '%%PUBLICATIONS_SECTION%%' => $this->buildPublicationsSection($resumeTranslation->publications ?? [], $localeConfig['publicationsHeading']),
            '%%TECHNICAL_PRODUCTIONS_SECTION%%' => $this->buildTechnicalProductionsSection($resumeTranslation->technical_productions ?? [], $localeConfig['technicalProductionsHeading']),
            '%%EVENTS_SECTION%%' => $this->buildEventsSection($resumeTranslation->events ?? [], $localeConfig['eventsHeading']),
            '%%AWARDS_SECTION%%' => $this->buildAwardsSection($resumeTranslation->awards ?? [], $localeConfig['awardsHeading']),
            '%%LANGUAGES_SECTION%%' => $this->buildLanguagesSection($resume->languages, $locale, $localeConfig),
        ];

        return strtr($template, $replacements);
    }

    private function escapeLatex(string $value): string
    {
        return str_replace(
            ['\\', '&', '%', '$', '#', '_', '{', '}', '~', '^'],
            ['\\textbackslash{}', '\\&', '\\%', '\\$', '\\#', '\\_', '\\{', '\\}', '\\textasciitilde{}', '\\textasciicircum{}'],
            $value
        );
    }

    private function stripProtocol(string $url): string
    {
        return preg_replace('#^https?://#', '', $url);
    }

    private function profilePlatformLabel(array $profile): string
    {
        if (! empty(trim($profile['label'] ?? ''))) {
            return trim($profile['label']);
        }

        return self::PLATFORM_LABELS[$profile['platform']] ?? $this->stripProtocol($profile['url']);
    }

    private function buildContactLinks($siteSettings, $siteSettingsTranslation): string
    {
        $links = [];

        if ($siteSettings->contact_email) {
            $links[] = '\\href{mailto:'.$siteSettings->contact_email.'}{'.$this->escapeLatex($siteSettings->contact_email).'}';
        }

        foreach ($siteSettings->contactProfiles as $profile) {
            if (empty(trim($profile->url ?? ''))) {
                continue;
            }
            $url = trim($profile->url);
            $label = $this->profilePlatformLabel(['label' => $profile->label, 'platform' => $profile->platform, 'url' => $url]);
            $links[] = '\\href{'.$url.'}{'.$this->escapeLatex($label).'}';
        }

        return implode("\n    ", array_map(fn ($link) => "{\\textbullet}\n    {$link}", $links));
    }

    private function buildTrajectoryItems(array $trajectory): string
    {
        $entries = [];
        foreach ($trajectory as $item) {
            if ($item['hidden'] ?? false) {
                continue;
            }
            $highlights = implode("\n", array_map(
                fn ($highlight) => '            \\item '.$this->escapeLatex($highlight),
                $item['highlights'] ?? []
            ));
            $entries[] = implode("\n", [
                '    \\cventry{'.$this->escapeLatex($item['organization']).'}{'.$this->escapeLatex($item['period']).'}{'.$this->escapeLatex($item['role']).'}{}',
                '        \\begin{itemize}',
                $highlights,
                '        \\end{itemize}',
            ]);
        }

        return implode("\n\n% ------\n\n", $entries);
    }

    private function buildOptionalSection(string $heading, string $body): string
    {
        if (trim($body) === '') {
            return '';
        }

        return implode("\n", ['% ------', '', "\\section{{$heading}}", $body, '']);
    }

    private function buildLeadershipSection(array $leadership, string $heading): string
    {
        $visible = array_filter($leadership, fn ($item) => ! ($item['hidden'] ?? false));
        if (count($visible) === 0) {
            return '';
        }

        return $this->buildOptionalSection($heading, $this->buildTrajectoryItems(array_values($visible)));
    }

    private function buildEducationSection(array $education, string $heading): string
    {
        $visible = array_filter($education, fn ($item) => ! ($item['hidden'] ?? false));
        if (count($visible) === 0) {
            return '';
        }

        $entries = array_map(
            fn ($item) => '    \\cventry{'.$this->escapeLatex($item['institution']).'}{'.$this->escapeLatex($item['period']).'}{'.$this->escapeLatex($item['degree']).'}{'.$this->escapeLatex($item['location']).'}',
            array_values($visible)
        );

        return $this->buildOptionalSection($heading, implode("\n\n% ------\n\n", $entries));
    }

    private function linkedTitle(string $name, ?string $url): string
    {
        $escaped = $this->escapeLatex($name);

        return ! empty(trim($url ?? '')) ? '\\href{'.trim($url).'}{'.$escaped.'}' : $escaped;
    }

    private function buildCredentialEntry(array $item): string
    {
        $issuer = ! empty(trim($item['credentialId'] ?? ''))
            ? $this->escapeLatex($item['issuer']).' ('.$this->escapeLatex(trim($item['credentialId'])).')'
            : $this->escapeLatex($item['issuer']);

        return '    \\cventry{'.$this->linkedTitle($item['name'], $item['url'] ?? null).'}{'.$this->escapeLatex($item['period']).'}{'.$issuer.'}{}';
    }

    private function buildCredentialsSection(array $credentials, string $heading): string
    {
        $visible = array_filter($credentials, fn ($item) => ! ($item['hidden'] ?? false));
        if (count($visible) === 0) {
            return '';
        }

        $entries = array_map(fn ($item) => $this->buildCredentialEntry($item), array_values($visible));

        return $this->buildOptionalSection($heading, implode("\n\n% ------\n\n", $entries));
    }

    private function buildPublicationsSection(array $publications, string $heading): string
    {
        $visible = array_filter($publications, fn ($item) => ! ($item['hidden'] ?? false) && ($item['includeInPdf'] ?? false));
        if (count($visible) === 0) {
            return '';
        }

        $entries = array_map(fn ($item) => $this->buildCredentialEntry($item), array_values($visible));

        return $this->buildOptionalSection($heading, implode("\n\n% ------\n\n", $entries));
    }

    private function buildEntryWithDescription(string $title, string $period, string $subtitle, ?string $description): string
    {
        $entry = '    \\cventry{'.$title.'}{'.$this->escapeLatex($period).'}{'.$subtitle.'}{}';

        if (empty(trim($description ?? ''))) {
            return $entry;
        }

        return implode("\n", [
            $entry,
            '        \\begin{itemize}',
            '            \\item '.$this->escapeLatex($description),
            '        \\end{itemize}',
        ]);
    }

    private function buildDescribedItemsSection(array $items, string $heading, callable $itemSubtitle): string
    {
        $visible = array_filter($items, fn ($item) => ! ($item['hidden'] ?? false) && ($item['includeInPdf'] ?? false));

        $entries = array_map(
            fn ($item) => $this->buildEntryWithDescription(
                $this->linkedTitle($item['name'], $item['url'] ?? null),
                $item['period'],
                $itemSubtitle($item),
                $item['description'] ?? null
            ),
            array_values($visible)
        );

        return $this->buildOptionalSection($heading, implode("\n\n% ------\n\n", $entries));
    }

    private function buildTechnicalProductionsSection(array $items, string $heading): string
    {
        return $this->buildDescribedItemsSection(
            $items,
            $heading,
            fn ($item) => $this->escapeLatex(self::TECHNICAL_PRODUCTION_KIND_LABELS[$item['kind']] ?? '')
        );
    }

    private function buildEventsSection(array $items, string $heading): string
    {
        $visible = array_filter($items, fn ($item) => ! ($item['hidden'] ?? false) && ($item['includeInPdf'] ?? false));
        if (count($visible) === 0) {
            return '';
        }

        $entries = array_map(function ($item) {
            $subtitle = implode(' — ', array_map(
                fn ($value) => $this->escapeLatex($value),
                array_filter([$item['talkTitle'] ?? null, $item['role'] ?? null], fn ($value) => ! empty(trim($value ?? '')))
            ));

            return '    \\cventry{'.$this->linkedTitle($item['name'], $item['url'] ?? null).'}{'.$this->escapeLatex($item['period']).'}{'.$subtitle.'}{'.$this->escapeLatex($item['location'] ?? '').'}';
        }, array_values($visible));

        return $this->buildOptionalSection($heading, implode("\n\n% ------\n\n", $entries));
    }

    private function buildAwardsSection(array $items, string $heading): string
    {
        return $this->buildDescribedItemsSection($items, $heading, fn ($item) => $this->escapeLatex($item['issuer']));
    }

    private function buildSelectedCases($cases, string $locale): string
    {
        $entries = $cases->map(function (CaseStudy $case) use ($locale) {
            $translation = $case->translation($locale);

            return implode("\n", [
                '    \\cventry{'.$this->escapeLatex($translation->title).'}{'.$this->escapeLatex($translation->status ?? '').'}{'.$this->escapeLatex($translation->meta ?? '').'}{}',
                '        \\begin{itemize}',
                '            \\item '.$this->escapeLatex($translation->summary ?? ''),
                '            \\item '.$this->escapeLatex($translation->role ?? ''),
                '            \\item '.$this->escapeLatex($translation->result ?? ''),
                '        \\end{itemize}',
            ]);
        });

        return $entries->implode("\n\n% ------\n\n");
    }

    private function buildSkillsSection($skills, string $locale, string $heading): string
    {
        if ($skills->count() === 0) {
            return '';
        }

        $items = $skills->map(function ($skill) use ($locale) {
            $label = $skill->topic?->translation($locale)->name ?? $skill->topic?->slug;
            $techNames = $skill->technologies->map(fn ($tech) => $tech->translation($locale)->name ?? $tech->slug);

            return '        \\item \\textbf{'.$this->escapeLatex($label).':} '.$techNames->map(fn ($item) => $this->escapeLatex($item))->implode(', ');
        })->implode("\n");

        return $this->buildOptionalSection(
            $heading,
            implode("\n", ['    \\begin{itemize}', $items, '    \\end{itemize}'])
        );
    }

    private function buildLanguagesSection($languages, string $locale, array $localeConfig): string
    {
        if ($languages->count() === 0) {
            return '';
        }

        $items = $languages->map(function ($resumeLanguage) use ($locale, $localeConfig) {
            $name = $resumeLanguage->language?->translation($locale)->name ?? $resumeLanguage->language?->slug;
            $proficiency = $resumeLanguage->proficiency === 'native'
                ? $localeConfig['nativeProficiency']
                : $resumeLanguage->proficiency;

            $suffix = $proficiency ? ' ('.$this->escapeLatex($proficiency).')' : '';

            return '        \\item '.$this->escapeLatex($name).$suffix;
        })->implode("\n");

        return $this->buildOptionalSection(
            $localeConfig['languagesHeading'],
            implode("\n", ['    \\begin{itemize}', $items, '    \\end{itemize}'])
        );
    }
}
