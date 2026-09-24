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
            ])
            ->whereIn('parent_id', $roots->pluck('id'))
            ->orderBy('order')
            ->orderBy('id')
            ->get();

        $presented = $roots->map(fn (object $item): array => $this->present(
            $item,
            $children->where('parent_id', $item->id),
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

    private function present(object $item, Collection $children, string $locale): array
    {
        return [
            'route' => $this->route($item->route_name, $locale),
            'placement' => $item->placement,
            'sidebar_group' => $item->sidebar_group,
            'children' => $children->map(fn (object $child): array => [
                'route' => $this->route($child->route_name, $locale),
                'children' => null,
            ])->values()->all(),
        ];
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
