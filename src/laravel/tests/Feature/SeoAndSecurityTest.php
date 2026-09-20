<?php

namespace Tests\Feature;

use App\Content\Seo;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SeoAndSecurityTest extends TestCase
{
    public function test_unmatched_routes_still_get_a_canonical_tag(): void
    {
        $response = $this->get('/this-page-does-not-exist');

        $response->assertStatus(404);
        $response->assertSee('rel="canonical"', false);
    }

    public function test_public_metadata_routes_are_available(): void
    {
        $robots = $this->get('/robots.txt');
        $robots->assertOk();
        $robots->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
        $robots->assertSee('Sitemap:', false);

        $sitemap = $this->get('/sitemap.xml');
        $sitemap->assertOk();
        $sitemap->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $sitemap->assertSee('<urlset', false);

        $feed = $this->get('/pt-BR/feed.json');
        $feed->assertOk();
        $feed->assertHeader('Content-Type', 'application/feed+json; charset=UTF-8');
        $feed->assertJsonPath('language', 'pt-BR');
    }

    public function test_matched_localized_routes_expose_hreflang_alternates(): void
    {
        Route::localized('__seo-test', fn () => response()->json([
            'canonical' => Seo::canonicalUrl(),
            'alternates' => Seo::alternateUrls(),
        ]), '__seo-test');
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
