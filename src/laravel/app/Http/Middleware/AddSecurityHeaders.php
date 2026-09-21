<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AddSecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $analyticsConfigured = (bool) (config('services.google.tag_manager_id') || config('services.google.analytics_id'));
        $analyticsScript = $analyticsConfigured ? ' https://www.googletagmanager.com' : '';
        $analyticsConnect = $analyticsConfigured ? ' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com' : '';

        $csp = [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'{$analyticsScript}",
            "style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self'{$analyticsConnect}",
            "worker-src 'self' blob:",
        ];

        $response->headers->set('Content-Security-Policy', implode('; ', $csp));
        $response->headers->set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');

        return $response;
    }
}
