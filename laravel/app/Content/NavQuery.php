<?php

namespace App\Content;

use App\Models\NavItem;
use Illuminate\Support\Collection;

/**
 * Reads the editable NavItem tree in the same flattened shape
 * App\Content\SiteNav used to return from hardcoded arrays, so
 * nav.blade.php/footer.blade.php can switch over to this without a
 * reshuffle of their own logic.
 */
final class NavQuery
{
    public function sidebarGroups(string $locale): array
    {
        return $this->roots($locale, fn ($query) => $query->where('placement', 'sidebar'))
            ->groupBy(fn (array $item) => $item['sidebar_group'])
            ->map(fn (Collection $items) => $items->map(fn (array $item) => $this->withoutGroup($item))->values()->all())
            ->values()
            ->all();
    }

    public function footerLinkItems(string $locale): array
    {
        return $this->roots($locale, fn ($query) => $query->where('placement', 'footer_links'))
            ->map(fn (array $item) => $this->withoutGroup($item))
            ->all();
    }

    public function siteMapTree(string $locale): array
    {
        return $this->roots($locale, fn ($query) => $query)
            ->map(fn (array $item) => $this->withoutGroup($item))
            ->all();
    }

    public function activeItem(?string $baseRouteName): ?string
    {
        return $this->findActive($baseRouteName)?->route_name;
    }

    public function activeParent(?string $baseRouteName): ?string
    {
        $item = $this->findActive($baseRouteName);

        if ($item === null || $item->parent_id === null) {
            return null;
        }

        return $item->parent?->route_name;
    }

    private function roots(string $locale, callable $scope): Collection
    {
        $query = NavItem::query()
            ->whereNull('parent_id')
            ->with(['translations', 'children.translations'])
            ->orderByRaw('sidebar_group is not null')
            ->orderBy('sidebar_group')
            ->orderBy('order')
            ->orderBy('id');

        return $scope($query)->get()->map(fn (NavItem $item) => $this->present($item, $locale));
    }

    private function present(NavItem $item, string $locale): array
    {
        $data = [
            'route' => $this->route($item->route_name, $locale),
            'label' => $item->translation($locale)?->label,
            'sidebar_group' => $item->sidebar_group,
            'children' => [],
        ];

        if ($item->children->isNotEmpty()) {
            $data['children'] = $item->children->map(fn (NavItem $child) => [
                'route' => $this->route($child->route_name, $locale),
                'label' => $child->translation($locale)?->label,
                'children' => null,
            ])->all();
        }

        return $data;
    }

    private function withoutGroup(array $item): array
    {
        unset($item['sidebar_group']);

        return $item;
    }

    private function findActive(?string $baseRouteName): ?NavItem
    {
        if ($baseRouteName === null) {
            return null;
        }

        return NavItem::query()
            ->with('parent')
            ->get()
            ->first(fn (NavItem $item) => $item->route_name === $baseRouteName
                || str_starts_with($baseRouteName, "{$item->route_name}."));
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
