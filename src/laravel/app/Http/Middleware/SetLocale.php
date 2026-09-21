<?php

namespace App\Http\Middleware;

use App\Content\Locale;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $routeName = $request->route()?->getName();
        $locale = $routeName
            ? (str_ends_with($routeName, '.pt-BR') ? 'pt-BR' : 'en')
            : Locale::fromRequestPath();

        app()->setLocale($locale);

        return $next($request);
    }
}
