<?php

namespace App\Http\Middleware;

use App\Content\SiteChromeQuery;
use App\Content\SiteSettingsQuery;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckMaintenanceMode
{
    /**
     * sitemap.xml, robots.txt, the feed formats, and og are gone from
     * Laravel's routes entirely — Blazor now serves them independently.
     * Only the public API keeps its own maintenance-aware degradation
     * (JSON 503) instead of the HTML maintenance page.
     */
    private const EXEMPT_PATHS = [
        'api/*',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is(self::EXEMPT_PATHS)) {
            return $next($request);
        }

        // The admin panel must stay reachable even during maintenance —
        // otherwise enabling maintenance mode locks the admin out of the
        // only place that can turn it back off. Path read from config, not
        // hardcoded, since ADMIN_PATH may move the panel off /admin.
        $adminPath = config('admin.path');
        if ($request->is($adminPath) || $request->is("{$adminPath}/*")) {
            return $next($request);
        }

        $siteSettings = (new SiteSettingsQuery)->find();

        if (! $siteSettings?->maintenance_enabled) {
            return $next($request);
        }

        $currentLocale = app()->getLocale();
        $chrome = (new SiteChromeQuery)->build($currentLocale);

        return response()
            ->view('pages.maintenance', [
                'chrome' => $chrome,
                'currentLocale' => $currentLocale,
            ], 503)
            ->header('Retry-After', (string) 3600);
    }
}
