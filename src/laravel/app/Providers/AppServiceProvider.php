<?php

namespace App\Providers;

use App\Content\Graph\NodeRegistry;
use App\Events\PublicSiteContentChanged;
use App\Listeners\InvalidatePublicSiteChrome;
use Dedoc\Scramble\Scramble;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Console\Events\CommandStarting;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Keycloak\KeycloakExtendSocialite;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(PublicSiteContentChanged::class, InvalidatePublicSiteChrome::class);

        Scramble::configure()->expose('docs', 'docs/openapi.json');

        Event::listen(CommandStarting::class, function (CommandStarting $event): void {
            $destructiveCommands = [
                'db:wipe',
                'migrate:fresh',
                'migrate:refresh',
                'migrate:reset',
                'schema:drop',
            ];

            if (app()->environment('testing') || ! in_array($event->command, $destructiveCommands, true)) {
                return;
            }

            throw new \RuntimeException(
                "Blocked destructive database command '{$event->command}' outside the testing environment.",
            );
        });

        Event::listen(SocialiteWasCalled::class, [KeycloakExtendSocialite::class, 'handle']);

        // Registers two physical routes per page (one unprefixed for English,
        // one under /pt-BR) sharing a common name so `route()` calls can
        // resolve either variant via App\Content\Locale::routeName(). This
        // avoids Laravel/Symfony's "optional-then-static-segment" routing
        // limitation, where `/{locale?}/about` silently fails to match `/about`.
        Route::macro('localized', function (string $uri, $action, string $name) {
            $cleanUri = $uri === '' ? '/' : '/'.ltrim($uri, '/');

            Route::get($cleanUri, $action)->name($name);
            Route::get('/pt-BR'.$cleanUri, $action)->name("{$name}.pt-BR");
        });

        Relation::morphMap(NodeRegistry::morphMap());

        RateLimiter::for('snippet-zip', function (Request $request) {
            return Limit::perMinute(10)->by($request->ip());
        });

        RateLimiter::for('public-api', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });
    }
}
