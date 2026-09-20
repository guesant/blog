<?php

namespace App\Content;

use Illuminate\Support\Facades\Route;

class Seo
{
    /**
     * Canonical URL for the current route in its current locale.
     */
    public static function canonicalUrl(): string
    {
        $route = request()->route();

        if (! $route) {
            return url()->current();
        }

        return route($route->getName(), $route->parameters());
    }

    /**
     * hreflang alternate URLs for the current route across every supported
     * locale, plus 'x-default' — same route, same parameters, only the
     * locale-suffixed route name changes.
     */
    public static function alternateUrls(): array
    {
        $route = request()->route();

        if (! $route) {
            return [];
        }

        $baseRouteName = Locale::baseRouteName($route->getName());
        $params = $route->parameters();

        $urls = [];
        foreach (Locale::all() as $locale) {
            $routeName = Locale::routeName($baseRouteName, $locale);

            if (! Route::has($routeName)) {
                continue;
            }

            $urls[$locale] = route($routeName, $params);
        }

        if (isset($urls['en'])) {
            $urls['x-default'] = $urls['en'];
        }

        return $urls;
    }
}
