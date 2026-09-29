<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Config;
use Tests\TestCase;

class KeycloakAuthTest extends TestCase
{
    public function test_admin_login_offers_keycloak_authentication(): void
    {
        $this->get('/admin/login')
            ->assertOk()
            ->assertSee('Roboto Slab')
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

    public function test_admin_access_requires_the_bound_oidc_subject(): void
    {
        Config::set('services.keycloak.base_url', 'https://auth.test/realms/management');
        $user = User::factory()->create([
            'oidc_issuer' => 'https://auth.test/realms/management',
            'oidc_subject' => 'subject-1',
        ]);

        $this->actingAs($user)
            ->withSession([
                'admin_oidc_authorized' => true,
                'admin_oidc_expires_at' => now()->addHour()->timestamp,
                'admin_oidc_issuer' => 'https://auth.test/realms/management',
                'admin_oidc_subject' => 'subject-2',
            ])
            ->get('/admin')
            ->assertRedirect('/admin/login');
    }

    public function test_email_allowlist_does_not_bypass_oidc_authorization(): void
    {
        Config::set('admin.allowed_emails', ['admin@example.com']);
        $user = User::factory()->create(['email' => 'admin@example.com']);

        $this->actingAs($user)
            ->get('/admin')
            ->assertRedirect('/admin/login');
    }
}
