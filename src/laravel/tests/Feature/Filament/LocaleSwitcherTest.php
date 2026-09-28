<?php

namespace Tests\Feature\Filament;

use Tests\TestCase;

class LocaleSwitcherTest extends TestCase
{
    public function test_panel_locale_switcher_persists_the_selected_locale(): void
    {
        $response = $this->from('/admin')->get(route('filament-language-switcher.switch', ['code' => 'pt_BR']));

        $response
            ->assertRedirect('/admin')
            ->assertCookie('filament_language_switcher_locale', 'pt_BR');

        $this->assertSame('pt_BR', $response->getSession()->get('locale'));

        $this->withSession(['locale' => 'pt_BR'])
            ->get('/admin/login')
            ->assertOk()
            ->assertSee('lang="pt-BR"', false);
    }
}
