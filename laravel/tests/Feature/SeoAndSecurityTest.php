<?php

namespace Tests\Feature;

use App\Content\Seo;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SeoAndSecurityTest extends TestCase
{
    public function test_unmatched_routes_still_get_a_canonical_tag(): void
    {
        // Every content page has moved to Blazor by now — boot/og/feeds/
        // sitemap/robots are all that's left in Laravel, and none of them
        // render through x-site.document. The 404 error page is the only
        // surviving template that does, so it's what's left to assert the
        // canonical tag against (Seo::canonicalUrl() falls back to the
        // current URL when no route matched, which a 404 exercises).
        $response = $this->get('/this-page-does-not-exist');

        $response->assertStatus(404);
        $response->assertSee('rel="canonical"', false);
    }

    public function test_matched_localized_routes_expose_hreflang_alternates(): void
    {
        // Seo::alternateUrls() reads the current route's localized siblings
        // (registered via Route::localized()), which requires an actual
        // matched route — no surviving Laravel page is both localized and
        // rendered through x-site.document (feed.xml/atom.xml/feed.json are
        // localized but aren't HTML pages, boot/og aren't localized at all).
        // Registering a throwaway pair of routes here exercises the same
        // mechanism directly instead of depending on the route being tested.
        Route::localized('__seo-test', fn () => response()->json([
            'canonical' => Seo::canonicalUrl(),
            'alternates' => Seo::alternateUrls(),
        ]), '__seo-test');
        // Route::name() only updates the route's own action array — the
        // router's name lookup is a snapshot taken once at boot, so a route
        // named after that point needs this to become resolvable by name.
        Route::getRoutes()->refreshNameLookups();

        $response = $this->get('/__seo-test');

        $response->assertOk();
        $response->assertJson([
            'canonical' => url('/__seo-test'),
            'alternates' => [
                'en' => url('/__seo-test'),
                'pt-BR' => url('/pt-BR/__seo-test'),
                'x-default' => url('/__seo-test'),
            ],
        ]);
    }

    public function test_security_headers_are_present(): void
    {
        // No content page is a Laravel route anymore (boot/og/feeds/sitemap/
        // robots are gone too), so a throwaway route registered directly on
        // the 'web' middleware group is what exercises AddSecurityHeaders.
        Route::get('/__security-test', fn () => response('ok'))->middleware('web');
        Route::getRoutes()->refreshNameLookups();

        $response = $this->get('/__security-test');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Cross-Origin-Opener-Policy', 'same-origin');
        $this->assertNotNull($response->headers->get('Content-Security-Policy'));
        $this->assertStringContainsString('wasm-unsafe-eval', $response->headers->get('Content-Security-Policy'));
    }
}
