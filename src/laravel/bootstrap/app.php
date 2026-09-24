<?php

use App\Http\Middleware\AddSecurityHeaders;
use App\Http\Middleware\CheckMaintenanceMode;
use App\Http\Middleware\SetLocale;
use App\Http\Responses\ApiErrorResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append([
            SetLocale::class,
        ]);

        $middleware->encryptCookies(except: ['guesant_tema']);

        $middleware->web(prepend: [
            CheckMaintenanceMode::class,
        ]);

        $middleware->web(append: [
            AddSecurityHeaders::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $documentationPaths = [
            'docs',
            'docs/*',
            'scalar',
            'scalar/*',
            'api/docs',
            'api/docs/*',
            'api/scalar',
            'api/scalar/*',
        ];

        $exceptions->render(function (Throwable $exception, Request $request) use ($documentationPaths) {
            if ($request->is($documentationPaths) || ! $request->is('api/*')) {
                return null;
            }

            return ApiErrorResponse::fromThrowable($exception);
        });

        $exceptions->shouldRenderJsonWhen(function (Request $request) use ($documentationPaths): bool {
            $documentationPath = collect($documentationPaths)
                ->contains(fn (string $path): bool => $request->is($path));

            return ! $documentationPath && ($request->is('api/*') || $request->expectsJson());
        });
    })->create();
