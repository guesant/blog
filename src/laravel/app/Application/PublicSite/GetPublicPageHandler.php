<?php

namespace App\Application\PublicSite;

use App\Content\Locale;
use App\Content\PageQuery;

final class GetPublicPageHandler
{
    public function __construct(
        private readonly PageQuery $pages,
    ) {}

    public function handle(GetPublicPage $query): ?PublicPageReadResult
    {
        $page = $this->pages->findBySlug($query->slug);
        if ($page === null) {
            return null;
        }

        $fields = $page->translation($query->locale)?->fields ?? [];
        if ($page->updated_at) {
            $fields['updated_at'] = $page->updated_at->format('Y-m-d H:i:s');
        }

        if ($page->slug === 'now') {
            $keys = [
                'trabalhando' => 'working',
                'construindo' => 'building',
                'estudando' => 'studying',
                'lendo' => 'reading',
                'ouvindo' => 'listening',
                'assistindo' => 'watching',
            ];
            $fields['entries'] = collect($keys)->map(
                fn (string $fallback, string $key): array => [
                    'key' => $key,
                    'value' => $fields[$key] ?? $fields[$fallback] ?? null,
                ],
            )->filter(fn (array $entry): bool => filled($entry['value']))->values()->all();
        }

        if ($page->slug === 'home') {
            $featuredItems = collect($page->currentRevision?->featuredCases ?? [])
                ->concat($page->currentRevision?->featuredProjects ?? []);

            $fields['recurringTechnologies'] = $featuredItems
                ->flatMap(fn ($item) => $item->technologies)
                ->unique('id')
                ->map(fn ($technology): array => [
                    'slug' => $technology->slug,
                    'name' => $technology->translation($query->locale)?->name ?? $technology->slug,
                    'logo' => $technology->logo,
                ])
                ->values()
                ->all();
        }

        if ($page->slug === 'follow') {
            $available = [
                ['key' => 'rss', 'url' => Locale::path('/feed.xml', $query->locale)],
                ['key' => 'atom', 'url' => Locale::path('/atom.xml', $query->locale)],
                ['key' => 'jsonfeed', 'url' => Locale::path('/feed.json', $query->locale)],
                ['key' => 'api', 'url' => '/api/v1/findings'],
                ['key' => 'sitemap', 'url' => Locale::path('/sitemap.xml', $query->locale)],
                ['key' => 'robots', 'url' => Locale::path('/robots.txt', $query->locale)],
                ['key' => 'webfinger'],
            ];
            $future = [['key' => 'activitypub'], ['key' => 'websub'], ['key' => 'webmention']];
            $buildEntry = fn (array $entry): array => [
                ...$entry,
                'title' => $fields["{$entry['key']}_title"] ?? null,
                'description' => $fields["{$entry['key']}_description"] ?? null,
            ];
            $fields['entries'] = collect($available)->map($buildEntry)->filter(
                fn (array $entry): bool => filled($entry['title']),
            )->values()->all();
            $fields['future_entries'] = collect($future)->map($buildEntry)->filter(
                fn (array $entry): bool => filled($entry['title']),
            )->values()->all();
        }

        return new PublicPageReadResult(
            slug: $page->slug,
            locale: $query->locale,
            fields: $fields,
        );
    }
}
