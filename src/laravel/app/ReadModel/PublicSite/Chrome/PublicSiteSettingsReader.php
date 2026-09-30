<?php

namespace App\ReadModel\PublicSite\Chrome;

use Illuminate\Support\Facades\DB;

final class PublicSiteSettingsReader
{
    public function read(string $locale): array
    {
        $settings = DB::table('site_settings as settings')
            ->leftJoin('site_settings_revisions as revision', 'revision.id', '=', 'settings.published_revision_id')
            ->select([
                'settings.id',
                'settings.published_revision_id',
                'revision.short_name',
                'revision.portfolio_url',
                'revision.source_repository_url',
                'revision.contact_email',
                'revision.contact_enabled',
                'revision.contact_available',
                'revision.maintenance_enabled',
                'revision.content_actions_copy_text',
                'revision.content_actions_copy_url',
                'revision.content_actions_download_text',
                'revision.contextual_cursor_enabled',
            ])
            ->first();

        if ($settings === null) {
            return [
                'short_name' => null,
                'portfolio_url' => '',
                'source_repository_url' => '',
                'contact_email' => null,
                'contact_email_available' => false,
                'contact_enabled' => true,
                'contact_available' => false,
                'maintenance_enabled' => false,
                'maintenance_title' => null,
                'maintenance_description' => null,
                'copyright_template' => null,
                'seo' => null,
                'contact_profiles' => [],
                'feature_flags' => [
                    'content_actions' => [
                        'copy_text' => false,
                        'copy_url' => false,
                        'download_text' => false,
                    ],
                    'contextual_cursor' => false,
                ],
            ];
        }

        $translation = $this->translation($settings->published_revision_id, $locale);
        $contactProfiles = DB::table('contact_profiles')
            ->join('platforms', 'platforms.id', '=', 'contact_profiles.platform_id')
            ->select(['platforms.slug as platform', 'platforms.label', 'contact_profiles.url'])
            ->where('contact_profiles.site_settings_id', $settings->id)
            ->orderBy('contact_profiles.order')
            ->orderBy('contact_profiles.id')
            ->get()
            ->map(static fn (object $profile): array => [
                'platform' => $profile->platform,
                'label' => $profile->label,
                'url' => $profile->url,
            ])
            ->all();

        return [
            'short_name' => $settings->short_name,
            'portfolio_url' => $settings->portfolio_url ?? '',
            'source_repository_url' => $settings->source_repository_url ?? '',
            'contact_email' => $settings->contact_email,
            'contact_email_available' => is_string($settings->contact_email) && $settings->contact_email !== '',
            'contact_enabled' => (bool) $settings->contact_enabled,
            'contact_available' => (bool) $settings->contact_available,
            'maintenance_enabled' => (bool) $settings->maintenance_enabled,
            'feature_flags' => [
                'content_actions' => [
                    'copy_text' => (bool) $settings->content_actions_copy_text,
                    'copy_url' => (bool) $settings->content_actions_copy_url,
                    'download_text' => (bool) $settings->content_actions_download_text,
                ],
                'contextual_cursor' => (bool) $settings->contextual_cursor_enabled,
            ],
            'maintenance_title' => $translation?->maintenance_title,
            'maintenance_description' => $translation?->maintenance_description,
            'copyright_template' => $translation?->copyright_template,
            'seo' => $this->seo($translation?->id),
            'contact_profiles' => $contactProfiles,
        ];
    }

    private function translation(?int $revisionId, string $locale): ?object
    {
        if ($revisionId === null) {
            return null;
        }

        return DB::table('site_settings_revision_translations')
            ->select([
                'id',
                'locale',
                'copyright_template',
                'maintenance_title',
                'maintenance_description',
            ])
            ->where('site_settings_revision_id', $revisionId)
            ->whereIn('locale', array_values(array_unique([$locale, 'en'])))
            ->orderByRaw('case when locale = ? then 0 else 1 end', [$locale])
            ->first();
    }

    private function seo(?int $translationId): ?array
    {
        if ($translationId === null) {
            return null;
        }

        $seo = DB::table('content_revision_seo')
            ->select([
                'title',
                'description',
                'canonical_url',
                'image_url',
                'image_alt',
                'robots',
                'no_index',
            ])
            ->where('content_type', 'site_settings')
            ->where('translation_id', $translationId)
            ->first();

        if ($seo === null) {
            return null;
        }

        return [
            'title' => $seo->title,
            'description' => $seo->description,
            'canonical' => $seo->canonical_url,
            'image' => $seo->image_url,
            'imageAlt' => $seo->image_alt,
            'robots' => $seo->robots,
            'noIndex' => (bool) $seo->no_index,
            'keywords' => DB::table('content_revision_seo_keywords')
                ->where('content_type', 'site_settings')
                ->where('translation_id', $translationId)
                ->orderBy('sort_order')
                ->pluck('keyword')
                ->all(),
        ];
    }
}
