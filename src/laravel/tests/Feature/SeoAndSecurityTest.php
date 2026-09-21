<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class SeoAndSecurityTest extends TestCase
{
    public function test_unmatched_api_routes_return_json(): void
    {
        $response = $this->get('/api/v1/public');

        $response->assertNotFound();
        $response->assertHeader('Content-Type', 'application/json');
        $response->assertJsonPath('error.code', 'not_found');
        $response->assertJsonPath('error.message', 'The requested resource was not found.');
        $response->assertJsonPath('error.status', 404);
        $response->assertJsonPath('error.details', []);
    }

    public function test_api_resource_errors_use_the_standard_contract(): void
    {
        $response = $this->get('/api/v1/content/unknown-collection');

        $response->assertNotFound();
        $response->assertJsonPath('error.code', 'not_found');
        $response->assertJsonPath('error.message', 'The requested resource was not found.');
        $response->assertJsonPath('error.status', 404);
        $response->assertJsonPath('error.details', []);
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

    public function test_unmatched_web_routes_do_not_render_the_public_layout(): void
    {
        $response = $this->get('/this-page-does-not-exist');

        $response->assertNotFound();
        $response->assertDontSee('site-nav', false);
        $response->assertDontSee('site-footer', false);
    }

    public function test_matched_localized_routes_return_json(): void
    {
        Route::localized('__seo-test', fn () => response()->json([
            'ok' => true,
        ]), '__seo-test');
        Route::getRoutes()->refreshNameLookups();

        $response = $this->get('/__seo-test');

        $response->assertOk();
        $response->assertJson(['ok' => true]);
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
