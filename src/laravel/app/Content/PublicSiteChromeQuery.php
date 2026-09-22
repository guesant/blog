<?php

namespace App\Content;

use App\Models\CaseStudy;
use App\Models\CreditEntry;
use App\Models\Experiment;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Resource;
use App\Models\Snippet;
use App\Models\Topic;
use App\Models\Writing;

final class PublicSiteChromeQuery
{
    public function __construct(
        private readonly SiteChromeQuery $siteChrome,
        private readonly NavQuery $navigation,
    ) {}

    public function build(string $locale): array
    {
        $chrome = $this->siteChrome->build($locale);
        $settings = $chrome['siteSettings'];
        $profile = $chrome['headerProfile'];
        $profileTranslation = $profile?->translation($locale);
        $navigation = $this->navigation->build($locale);

        return [
            'site' => [
                'short_name' => $settings?->short_name,
                'portfolio_url' => $settings?->portfolio_url ?? '',
                'source_repository_url' => $settings?->source_repository_url ?? '',
                'contact_available' => $settings?->contact_available ?? false,
                'contact_profiles' => $settings?->contactProfiles->map(fn ($contactProfile) => [
                    'platform' => $contactProfile->platform,
                    'label' => $contactProfile->label ?: $contactProfile->platform,
                    'url' => $contactProfile->url,
                ])->values()->all(),
                'protected_email' => null,
                'maintenance_enabled' => $settings?->maintenance_enabled ?? false,
                'maintenance_eyebrow' => $settings?->translation($locale)?->maintenance_eyebrow,
                'maintenance_title' => $settings?->translation($locale)?->maintenance_title,
                'maintenance_description' => $settings?->translation($locale)?->maintenance_description,
                'seo' => $settings?->translation($locale)?->seo,
            ],
            'profile' => $profile ? [
                'name' => $profile->name,
                'title' => $profileTranslation?->title,
                'location' => $profileTranslation?->location,
                'description' => $profileTranslation?->description,
                'milestones' => $profileTranslation?->milestones,
                'birth_date' => $profile->birth_date?->toDateString() ?? '',
                'birth_city' => $profileTranslation?->birth_city,
                'interests' => $profileTranslation?->interests,
                'learning' => $profileTranslation?->learning,
                'personal_interests' => $profileTranslation?->personal_interests,
            ] : null,
            'copyright' => $chrome['copyright'],
            'navigation' => $navigation,
            'build' => [
                'commit_sha' => $chrome['commitSha'],
                'build_time' => $chrome['buildTime'],
            ],
            'visibility' => $this->visibility($locale, $profile, $settings),
        ];
    }

    private function visibility(string $locale, $profile, $settings): array
    {
        return [
            'about' => $profile !== null,
            'resume' => $this->hasResume($locale, $profile),
            'portfolio' => Project::where('hidden', false)->where('nda', false)->exists()
                || CaseStudy::where('hidden', false)->where('nda', false)->exists()
                || Experiment::where('hidden', false)->exists(),
            'cases' => CaseStudy::where('hidden', false)->where('nda', false)->exists(),
            'contact' => (bool) ($settings?->contact_available),
            'license' => $this->pageHasAny($locale, 'license', ['code_body', 'content_body', 'ai_body']),
            'credits' => CreditEntry::where('active', true)->exists(),
            'follow' => $this->pageHasAny($locale, 'follow', ['rss_title', 'atom_title', 'jsonfeed_title', 'api_title', 'sitemap_title', 'robots_title', 'webfinger_title', 'activitypub_title', 'websub_title', 'webmention_title']),
            'feed' => Writing::where('hidden', false)->exists(),
            'writing' => Writing::where('hidden', false)->exists(),
            'findings' => Resource::public()->exists(),
            'topics' => Topic::where('hidden', false)->exists(),
            'collections' => ReferenceCollection::where('hidden', false)->exists(),
            'snippets' => Snippet::where('hidden', false)->exists(),
            'right_sidebar' => (bool) ($settings?->contact_available),
        ];
    }

    private function pageHasAny(string $locale, string $slug, array $fields): bool
    {
        $values = (new PageQuery)->findBySlug($slug)?->translation($locale)?->fields ?? [];

        foreach ($fields as $field) {
            if (! empty($values[$field])) {
                return true;
            }
        }

        return false;
    }

    private function hasResume(string $locale, $profile): bool
    {
        $resume = (new ResumeQuery)->find();

        return $resume?->translation($locale)?->summary !== null
            || ! empty($profile?->translation($locale)?->trajectory);
    }
}
