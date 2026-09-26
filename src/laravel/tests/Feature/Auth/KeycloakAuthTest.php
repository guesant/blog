<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Tests\TestCase;

class KeycloakAuthTest extends TestCase
{
    public function test_admin_login_offers_keycloak_authentication(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee(route('auth.keycloak.redirect'));
    }

    public function test_keycloak_authentication_requires_configuration(): void
    {
        $this->get('/auth/keycloak/redirect')->assertServiceUnavailable();
    }

    public function test_expired_oidc_session_redirects_to_admin_login(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->withSession([
                'admin_oidc_authorized' => true,
                'admin_oidc_expires_at' => now()->subSecond()->timestamp,
            ])
            ->get('/admin')
            ->assertRedirect('/admin/login');
    }
}
