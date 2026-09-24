<?php

namespace App\Http\Middleware;

use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\ReadModel\PublicSite\Content\SiteSettingsReader;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    private const EXEMPT_PATHS = [
        'api/*',
        'auth/keycloak/*',
    ];

    public function __construct(
        private readonly SiteSettingsReader $settings,
    ) {}

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is(self::EXEMPT_PATHS) || $request->routeIs('filament.*')) {
            return $next($request);
        }

        $adminPath = config('admin.path');
        if ($request->is($adminPath) || $request->is("{$adminPath}/*")) {
            return $next($request);
        }

        $siteSettings = $this->settings->find();

        if (! $siteSettings?->maintenance_enabled) {
            return $next($request);
        }

        return ApiErrorResponse::make(
            ApiErrorCode::Maintenance,
            503,
            'The service is temporarily unavailable.',
        )
            ->header('Retry-After', (string) 3600);
    }
}
