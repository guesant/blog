<?php

namespace App\Content;

class Locale
{
    public static function normalize(?string $locale): string
    {
        return $locale === 'pt-BR' ? 'pt-BR' : 'en';
    }

    /**
     * Resolve a locale-agnostic route name (e.g. 'about') to the physical
     * route name for the given locale (e.g. 'about.pt-BR'), matching the
     * naming convention registered by Route::localized().
     */
    public static function routeName(string $name, ?string $locale = null): string
    {
        return self::normalize($locale) === 'pt-BR' ? "{$name}.pt-BR" : $name;
    }

    /**
     * Strip a '.pt-BR' suffix off a physical route name, recovering the
     * locale-agnostic base name (e.g. 'about.pt-BR' -> 'about').
     */
    public static function baseRouteName(string $routeName): string
    {
        return str_ends_with($routeName, '.pt-BR') ? substr($routeName, 0, -6) : $routeName;
    }

    public static function all(): array
    {
        return ['en', 'pt-BR'];
    }

    /**
     * Best-effort locale detection from the raw request path, used when no
     * route matched (e.g. a genuine 404) so SetLocale never ran.
     */
    public static function fromRequestPath(): string
    {
        return request()->is('pt-BR', 'pt-BR/*') ? 'pt-BR' : 'en';
    }

    /**
     * Locale-prefixed URL path for locale-agnostic content that no longer
     * has (or is about to lose) a named route — plain string construction,
     * mirroring the '/pt-BR' prefix Route::localized() applies, so callers
     * don't depend on the named-route registry for URLs to routes that get
     * deregistered as this migration deletes Laravel pages one by one.
     */
    public static function path(string $path, ?string $locale = null): string
    {
        $path = '/'.ltrim($path, '/');

        if ($path === '/') {
            return self::normalize($locale) === 'pt-BR' ? '/pt-BR' : '/';
        }

        return self::normalize($locale) === 'pt-BR' ? '/pt-BR'.$path : $path;
    }

    /**
     * Absolute version of path(), for contexts that previously got an
     * absolute URL from route() (sitemap, feeds, the public API).
     */
    public static function url(string $path, ?string $locale = null): string
    {
        return self::path($path, $locale);
    }
}
