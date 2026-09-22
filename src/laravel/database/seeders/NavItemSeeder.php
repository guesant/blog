<?php

namespace Database\Seeders;

use App\Models\NavItem;
use Illuminate\Database\Seeder;

/**
 * One-time migration of the hand-maintained App\Content\SiteNav tree into
 * editable NavItem/NavItemTranslation rows. It is invoked by the initial
 * navigation migration and can also be run manually with:
 *
 *   php artisan db:seed --class=NavItemSeeder
 *
 * Safe to re-run: every item is upserted by route_name, which is unique
 * across the current tree.
 *
 * Labels below are copied verbatim from lang/en/nav.php and
 * lang/pt-BR/nav.php as of the SiteNav migration, not re-derived from the
 * lang files at runtime, so this seeder keeps producing the same rows even
 * if those files change later.
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

        foreach ($entry['translations'] as $locale => $label) {
            $navItem->translations()->updateOrCreate(
                ['locale' => $locale],
                ['label' => $label],
            );
        }

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
     * Mirrors SiteNav::SIDEBAR_GROUPS, but with the actual translated
     * labels and children inlined instead of a 'nav.*' lang key, so
     * SiteNav does not need to be touched to run this seeder.
     */
    private function sidebarGroups(): array
    {
        return [
            [$this->writing(), $this->findings()],
            [$this->topics(), $this->collections()],
            [$this->snippets(), $this->tools()],
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
        return ['route' => 'home', 'translations' => ['en' => 'Home', 'pt-BR' => 'Início']];
    }

    private function writing(): array
    {
        return ['route' => 'writing', 'translations' => ['en' => 'Writing', 'pt-BR' => 'Escritos']];
    }

    private function snippets(): array
    {
        return ['route' => 'snippets', 'translations' => ['en' => 'Snippets', 'pt-BR' => 'Snippets']];
    }

    private function findings(): array
    {
        return ['route' => 'findings', 'translations' => ['en' => 'findings', 'pt-BR' => 'achados']];
    }

    private function collections(): array
    {
        return ['route' => 'collections', 'translations' => ['en' => 'Collections', 'pt-BR' => 'Coleções']];
    }

    private function topics(): array
    {
        return ['route' => 'topics', 'translations' => ['en' => 'Topics', 'pt-BR' => 'Tópicos']];
    }

    private function portfolio(): array
    {
        return [
            'route' => 'portfolio',
            'translations' => ['en' => 'Portfolio', 'pt-BR' => 'Portfólio'],
            'children' => [
                ['route' => 'cases', 'translations' => ['en' => 'Cases', 'pt-BR' => 'Cases']],
                ['route' => 'projects', 'translations' => ['en' => 'projects', 'pt-BR' => 'projetos']],
            ],
        ];
    }

    private function about(): array
    {
        return ['route' => 'about', 'translations' => ['en' => 'About Me', 'pt-BR' => 'Sobre mim']];
    }

    private function agora(): array
    {
        return ['route' => 'now', 'translations' => ['en' => 'Now', 'pt-BR' => 'Agora']];
    }

    private function resume(): array
    {
        return ['route' => 'resume', 'translations' => ['en' => 'Résumé', 'pt-BR' => 'Currículo']];
    }

    private function follow(): array
    {
        return ['route' => 'follow', 'translations' => ['en' => 'Follow', 'pt-BR' => 'Acompanhe']];
    }

    private function tools(): array
    {
        return ['route' => 'tools', 'translations' => ['en' => 'Tools', 'pt-BR' => 'Ferramentas']];
    }
}
