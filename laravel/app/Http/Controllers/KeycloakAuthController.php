<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Socialite;
use Illuminate\Support\Str;

class KeycloakAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        abort_unless($this->isConfigured(), 503);

        return Socialite::driver('keycloak')->enablePKCE()->redirect();
    }

    public function callback(Request $request): RedirectResponse
    {
        abort_unless($this->isConfigured(), 503);

        $keycloakUser = Socialite::driver('keycloak')->enablePKCE()->user();
        $groups = Arr::wrap($keycloakUser->getRaw()['groups'] ?? []);

        abort_unless(in_array(config('admin.oidc_group'), $groups, true), 403);

        $email = $keycloakUser->getEmail();
        abort_unless(filled($email), 403);

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $keycloakUser->getName() ?: $keycloakUser->getNickname() ?: $email,
                'email_verified_at' => now(),
                'password' => Hash::make(Str::random(64)),
            ],
        );

        Auth::login($user, true);
        $request->session()->regenerate();
        $request->session()->put('admin_oidc_authorized', true);
        $request->session()->put(
            'admin_oidc_id_token',
            Arr::get($keycloakUser->accessTokenResponseBody ?? [], 'id_token'),
        );

        return redirect()->intended('/'.trim(config('admin.path'), '/'));
    }

    public function logout(Request $request): RedirectResponse
    {
        $idToken = $request->session()->pull('admin_oidc_id_token');
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if (! $this->isConfigured()) {
            return redirect('/');
        }

        return redirect(Socialite::driver('keycloak')->getLogoutUrl(
            url('/'),
            config('services.keycloak.client_id'),
            $idToken,
        ));
    }

    private function isConfigured(): bool
    {
        return filled(config('services.keycloak.client_id'))
            && filled(config('services.keycloak.client_secret'))
            && filled(config('services.keycloak.base_url'))
            && filled(config('services.keycloak.realms'))
            && filled(config('services.keycloak.redirect'));
    }
}
