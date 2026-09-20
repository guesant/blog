<?php

use App\Http\Middleware\AddSecurityHeaders;
use App\Http\Middleware\CheckMaintenanceMode;
use App\Http\Middleware\SetLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Global (not web-group-only): must still run when no route matches,
        // e.g. a genuine 404, since web-group middleware only attaches to a
        // matched route. AddSecurityHeaders stays web-group-only below —
        // promoting it here would also apply the public-site CSP to /admin,
        // which breaks Filament/Livewire/Alpine (they need 'unsafe-eval').
        $middleware->append([
            SetLocale::class,
        ]);

        // guesant_tema is set by plain client-side JS (saguão/theme
        // selectors), not by a Laravel response — EncryptCookies would
        // otherwise fail to decrypt it and request()->cookie() would
        // silently read null, breaking the footer's "back to theme" link.
        $middleware->encryptCookies(except: ['guesant_tema']);

        $middleware->web(prepend: [
            CheckMaintenanceMode::class,
        ]);

        $middleware->web(append: [
            AddSecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (NotFoundHttpException $exception): Response {
            return response()->view('errors.404', status: 404);
        });

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
