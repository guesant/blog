<?php

namespace App\ReadModel\PublicSite\Chrome;

use App\Content\Locale;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class PublicNavigationReader
{
    public function read(string $locale): array
    {
        $roots = DB::table('nav_items')
            ->select([
                'id',
                'route_name',
                'parent_id',
                'placement',
                'sidebar_group',
                'order',
                'current_revision_id',
            ])
            ->whereNull('parent_id')
            ->orderByRaw('sidebar_group is not null')
            ->orderBy('sidebar_group')
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        $children = DB::table('nav_items')
            ->select([
                'id',
                'route_name',
                'parent_id',
                'placement',
                'sidebar_group',
                'order',
                'current_revision_id',
            ])
            ->whereIn('parent_id', $roots->pluck('id'))
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        $items = $roots->concat($children);
        $translations = $this->translations($items, $locale);
        $presented = $roots->map(fn (object $item): array => $this->present(
            $item,
            $children->where('parent_id', $item->id),
            $translations,
            $locale,
        ));

        return [
            'sidebar' => $presented
                ->filter(static fn (array $item): bool => $item['placement'] === 'sidebar')
                ->groupBy(static fn (array $item): mixed => $item['sidebar_group'])
                ->map(fn (Collection $group): array => $group
                    ->map(fn (array $item): array => $this->withoutGroup($item))
                    ->values()
                    ->all())
                ->values()
                ->all(),
            'footer_links' => $presented
                ->filter(static fn (array $item): bool => $item['placement'] === 'footer_links')
                ->map(fn (array $item): array => $this->withoutGroup($item))
                ->values()
                ->all(),
            'sitemap' => $presented
                ->map(fn (array $item): array => $this->withoutGroup($item))
                ->values()
                ->all(),
        ];
    }

    private function translations(Collection $items, string $locale): Collection
    {
        return DB::table('nav_item_revision_translations')
            ->select(['nav_item_revision_id', 'locale', 'label'])
            ->whereIn('nav_item_revision_id', $items->pluck('current_revision_id')->filter()->unique())
            ->whereIn('locale', array_values(array_unique([$locale, 'en'])))
            ->get()
            ->groupBy('nav_item_revision_id');
    }

    private function present(object $item, Collection $children, Collection $translations, string $locale): array
    {
        return [
            'route' => $this->route($item->route_name, $locale),
            'label' => $this->label($item->current_revision_id, $translations, $locale),
            'placement' => $item->placement,
            'sidebar_group' => $item->sidebar_group,
            'children' => $children->map(fn (object $child): array => [
                'route' => $this->route($child->route_name, $locale),
                'label' => $this->label($child->current_revision_id, $translations, $locale),
                'children' => null,
            ])->values()->all(),
        ];
    }

    private function label(?int $revisionId, Collection $translations, string $locale): ?string
    {
        $rows = $translations->get($revisionId, collect());

        return $rows->firstWhere('locale', $locale)?->label
            ?? $rows->firstWhere('locale', 'en')?->label;
    }

    private function withoutGroup(array $item): array
    {
        unset($item['sidebar_group'], $item['placement']);

        return $item;
    }

    private function route(string $name, string $locale): string
    {
        $path = match ($name) {
            'home' => '/',
            'projects.show' => '/projects',
            'cases.show' => '/cases',
            'writing.show' => '/writing',
            'findings.show' => '/findings',
            'collections.show' => '/collections',
            'topics.show' => '/topics',
            'technologies.show' => '/technologies',
            'snippets.show' => '/snippets',
            'projects.experiments.show' => '/projects/experiments',
            default => '/'.str_replace('.', '/', $name),
        };

        return Locale::path($path, $locale);
    }
}
