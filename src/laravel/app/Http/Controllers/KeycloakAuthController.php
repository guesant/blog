<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

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
        $raw = $keycloakUser->getRaw();
        $groups = Arr::wrap($raw['groups'] ?? []);

        abort_unless(in_array(config('admin.oidc_group'), $groups, true), 403);

        $email = $keycloakUser->getEmail();
        $subject = $raw['sub'] ?? null;
        $emailVerified = filter_var($raw['email_verified'] ?? false, FILTER_VALIDATE_BOOL);
        $issuer = rtrim((string) config('services.keycloak.base_url'), '/');
        abort_unless(filled($email), 403);
        abort_unless(filled($subject) && $emailVerified === true, 403);

        $user = User::query()
            ->where('oidc_issuer', $issuer)
            ->where('oidc_subject', $subject)
            ->first();

        if ($user === null) {
            $user = User::query()->where('email', $email)->first();
            abort_unless(
                $user === null || ($user->oidc_issuer === null && $user->oidc_subject === null),
                403,
            );
        }

        $user ??= new User(['password' => Hash::make(Str::random(64))]);
        $user->fill([
            'name' => $keycloakUser->getName() ?: $keycloakUser->getNickname() ?: $email,
            'email' => $email,
            'oidc_issuer' => $issuer,
            'oidc_subject' => $subject,
        ]);
        $user->email_verified_at = now();
        $user->save();

        $expiresIn = max((int) Arr::get($keycloakUser->accessTokenResponseBody ?? [], 'expires_in', 3600), 1);

        Auth::login($user);
        $request->session()->regenerate();
        $request->session()->put('admin_oidc_authorized', true);
        $request->session()->put('admin_oidc_issuer', $issuer);
        $request->session()->put('admin_oidc_subject', $subject);
        $request->session()->put('admin_oidc_expires_at', now()->addSeconds($expiresIn)->timestamp);
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
