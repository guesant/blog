<?php

namespace Database\Seeders;

use App\Models\NavItem;
use Illuminate\Database\Seeder;

/**
 * One-time migration of the hand-maintained App\Content\SiteNav tree into
 * editable NavItem rows. It is invoked by the initial
 * navigation migration and can also be run manually with:
 *
 *   php artisan db:seed --class=NavItemSeeder
 *
 * Safe to re-run: every item is upserted by route_name, which is unique
 * across the current tree.
 */
class NavItemSeeder extends Seeder
{
    public function run(): void
    {
        $this->upsert($this->home(), [
            'placement' => null,
            'sidebar_group' => null,
            'order' => 0,
            'parent_id' => null,
        ]);

        $sidebarGroupIndex = 0;

        foreach ($this->sidebarGroups() as $group) {
            $order = 0;

            foreach ($group as $entry) {
                $this->upsert($entry, [
                    'placement' => 'sidebar',
                    'sidebar_group' => $sidebarGroupIndex,
                    'order' => $order,
                    'parent_id' => null,
                ]);

                $order++;
            }

            $sidebarGroupIndex++;
        }

        $order = 0;

        foreach ($this->footerItems() as $entry) {
            $this->upsert($entry, [
                'placement' => 'footer_links',
                'sidebar_group' => null,
                'order' => $order,
                'parent_id' => null,
            ]);

            $order++;
        }
    }

    private function upsert(array $entry, array $attributes): void
    {
        $navItem = NavItem::updateOrCreate(
            ['route_name' => $entry['route']],
            [...$attributes, 'route_name' => $entry['route']],
        );

        $childOrder = 0;

        foreach ($entry['children'] ?? [] as $child) {
            $this->upsert($child, [
                'placement' => null,
                'sidebar_group' => null,
                'order' => $childOrder,
                'parent_id' => $navItem->id,
            ]);

            $childOrder++;
        }
    }

    /**
     * Mirrors SiteNav::SIDEBAR_GROUPS with children inlined so SiteNav does
     * not need to be touched to run this seeder.
     */
    private function sidebarGroups(): array
    {
        return [
            [$this->writing(), $this->findings()],
            [$this->topics(), $this->collections()],
            [$this->snippets()],
            [$this->about(), $this->agora(), $this->resume(), $this->portfolio()],
        ];
    }

    /**
     * Mirrors SiteNav::FOOTER_ROUTES.
     */
    private function footerItems(): array
    {
        return [$this->follow()];
    }

    private function home(): array
    {
        return ['route' => 'home'];
    }

    private function writing(): array
    {
        return ['route' => 'writing'];
    }

    private function snippets(): array
    {
        return ['route' => 'snippets'];
    }

    private function findings(): array
    {
        return ['route' => 'findings'];
    }

    private function collections(): array
    {
        return ['route' => 'collections'];
    }

    private function topics(): array
    {
        return ['route' => 'topics'];
    }

    private function portfolio(): array
    {
        return [
            'route' => 'portfolio',
            'children' => [
                ['route' => 'cases'],
                ['route' => 'projects'],
            ],
        ];
    }

    private function about(): array
    {
        return ['route' => 'about'];
    }

    private function agora(): array
    {
        return ['route' => 'now'];
    }

    private function resume(): array
    {
        return ['route' => 'resume'];
    }

    private function follow(): array
    {
        return ['route' => 'follow'];
    }
}
