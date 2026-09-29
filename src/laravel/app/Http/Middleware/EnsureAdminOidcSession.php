<?php

namespace App\Http\Middleware;

use Closure;
use Filament\Facades\Filament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminOidcSession
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return $next($request);
        }

        $user = Auth::user();
        $expiresAt = session('admin_oidc_expires_at');
        $hasValidOidcSession = session('admin_oidc_authorized') === true
            && is_numeric($expiresAt)
            && (int) $expiresAt > now()->timestamp
            && session('admin_oidc_issuer') === rtrim((string) config('services.keycloak.base_url'), '/')
            && session('admin_oidc_subject') === $user?->oidc_subject;

        if ($hasValidOidcSession) {
            return $next($request);
        }

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->guest(Filament::getLoginUrl());
    }
}
