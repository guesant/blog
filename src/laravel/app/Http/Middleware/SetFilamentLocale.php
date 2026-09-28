<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetFilamentLocale
{
    /** @psalm-suppress PossiblyUnusedMethod */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->session()->get(
            'locale',
            $request->cookie('filament_language_switcher_locale', config('app.locale', 'en')),
        );

        if (! in_array($locale, ['en', 'pt_BR'], true)) {
            $locale = 'en';
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
