<?php

namespace App\ReadModel\PublicSite\Chrome;

use Illuminate\Support\Facades\DB;

final class PublicSiteSettingsReader
{
    public function read(string $locale): array
    {
        $settings = DB::table('site_settings')
            ->select([
                'id',
                'short_name',
                'portfolio_url',
                'source_repository_url',
                'contact_email',
                'contact_available',
                'maintenance_enabled',
                'current_revision_id',
            ])
            ->first();

        if ($settings === null) {
            return [
                'short_name' => null,
                'portfolio_url' => '',
                'source_repository_url' => '',
                'contact_email' => null,
                'contact_available' => false,
                'maintenance_enabled' => false,
                'maintenance_eyebrow' => null,
                'maintenance_title' => null,
                'maintenance_description' => null,
                'copyright_template' => null,
                'seo' => null,
                'contact_profiles' => [],
            ];
        }

        $translation = $this->translation($settings->current_revision_id, $locale);
        $contactProfiles = DB::table('contact_profiles')
            ->select(['platform', 'label', 'url'])
            ->where('site_settings_id', $settings->id)
            ->orderBy('order')
            ->orderBy('id')
            ->get()
            ->map(static fn (object $profile): array => [
                'platform' => $profile->platform,
                'label' => $profile->label ?: $profile->platform,
                'url' => $profile->url,
            ])
            ->all();

        return [
            'short_name' => $settings->short_name,
            'portfolio_url' => $settings->portfolio_url ?? '',
            'source_repository_url' => $settings->source_repository_url ?? '',
            'contact_email' => $settings->contact_email,
            'contact_available' => (bool) $settings->contact_available,
            'maintenance_enabled' => (bool) $settings->maintenance_enabled,
            'maintenance_eyebrow' => $translation?->maintenance_eyebrow,
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
                'maintenance_eyebrow',
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
