<?php

namespace Tests\Feature\Filament;

use App\Models\CreditCategory;
use App\Models\NavItem;
use App\Models\User;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class AdminPageSmokeTest extends TestCase
{
    public function test_registered_admin_pages_render_successfully(): void
    {
        $this->actingAsAdmin();

        foreach ($this->staticAdminRoutes() as $route) {
            $response = $this->get(route($route->getName()));

            $this->assertTrue(
                $response->isSuccessful(),
                sprintf(
                    'Filament route %s returned HTTP %d.',
                    $route->getName(),
                    $response->getStatusCode(),
                ),
            );
        }
    }

    public function test_registered_admin_edit_pages_render_successfully(): void
    {
        $this->actingAsAdmin();

        foreach ($this->editableAdminRoutes() as $route) {
            $record = $this->recordForEditRoute($route);
            $response = $this->get(route($route->getName(), ['record' => $record]));

            $this->assertTrue(
                $response->isSuccessful(),
                sprintf(
                    'Filament edit route %s returned HTTP %d.',
                    $route->getName(),
                    $response->getStatusCode(),
                ),
            );
        }
    }

    private function actingAsAdmin(): User
    {
        Config::set('admin.allowed_emails', ['admin@example.com']);
        $user = User::factory()->create(['email' => 'admin@example.com']);
        $this->actingAs($user);

        return $user;
    }

    private function staticAdminRoutes(): array
    {
        return collect(app('router')->getRoutes()->getRoutes())
            ->filter(fn (Route $route): bool => $this->isAdminGetRoute($route))
            ->reject(fn (Route $route): bool => str_contains($route->getName() ?? '', '.auth.login'))
            ->reject(fn (Route $route): bool => str_contains($route->uri(), '{'))
            ->values()
            ->all();
    }

    private function editableAdminRoutes(): array
    {
        return collect(app('router')->getRoutes()->getRoutes())
            ->filter(fn (Route $route): bool => $this->isAdminGetRoute($route))
            ->filter(fn (Route $route): bool => str_ends_with($route->getName() ?? '', '.edit'))
            ->values()
            ->all();
    }

    private function isAdminGetRoute(Route $route): bool
    {
        return str_starts_with($route->getName() ?? '', 'filament.admin.')
            && in_array('GET', $route->methods(), true);
    }

    private function recordForEditRoute(Route $route): object
    {
        $pageClass = $route->getAction('controller');
        $resourceClass = $pageClass::getResource();
        $modelClass = $resourceClass::getModel();

        if ($modelClass === CreditCategory::class) {
            return CreditCategory::query()->create([
                'slug' => 'smoke-test-category',
                'order' => 0,
                'active' => true,
            ]);
        }

        if ($modelClass === NavItem::class) {
            return NavItem::query()->create([
                'route_name' => 'home',
                'placement' => 'sidebar',
                'sidebar_group' => 0,
                'order' => 0,
            ]);
        }

        return $modelClass::factory()->create();
    }
}
