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

        // The Vite dev server runs on a separate origin (port 5173); production
        // serves pre-built assets same-origin, so this never applies there.
        $viteDevServer = app()->environment('local') ? ' http://localhost:5173' : '';
        $viteDevServerWs = app()->environment('local') ? ' ws://localhost:5173' : '';

        // Only widen the CSP for Google's analytics domains when analytics is
        // actually configured — an unconfigured site keeps the tighter policy.
        $analyticsConfigured = (bool) (config('services.google.tag_manager_id') || config('services.google.analytics_id'));
        $analyticsScript = $analyticsConfigured ? ' https://www.googletagmanager.com' : '';
        $analyticsConnect = $analyticsConfigured ? ' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com' : '';

        $csp = [
            "default-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "frame-ancestors 'none'",
            "form-action 'self'",
            // 'unsafe-eval' is required by Alpine.js, which evaluates x-data
            // expressions via Function() rather than static parsing.
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'{$viteDevServer}{$analyticsScript}",
            "style-src 'self' 'unsafe-inline'{$viteDevServer}",
            "img-src 'self' data: https:",
            "font-src 'self' data:{$viteDevServer}",
            "connect-src 'self'{$viteDevServer}{$viteDevServerWs}{$analyticsConnect}",
            "worker-src 'self' blob:{$viteDevServer}",
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
