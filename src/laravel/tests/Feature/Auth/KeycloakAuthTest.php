<?php

namespace Tests\Feature\Auth;

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
}
