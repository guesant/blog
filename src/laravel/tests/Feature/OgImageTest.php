<?php

namespace Tests\Feature;

use App\OpenGraph\OgImageUrlGenerator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\TestCase;

final class OgImageTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'og.enabled' => true,
            'og.secret' => 'test-secret',
            'og.base_url' => 'https://api.example.test',
            'og.cache_disk' => 'local',
            'og.cache_prefix' => 'framework/testing/og',
            'cache.default' => 'array',
        ]);

        Storage::fake('local');
    }

    public function test_signed_url_returns_png_with_immutable_cache_headers(): void
    {
        $url = app(OgImageUrlGenerator::class)->generate(
            'article',
            'Título Unicode',
            'Descrição',
        );

        $path = parse_url((string) $url, PHP_URL_PATH);
        $response = $this->get((string) $path);

        $response
            ->assertOk()
            ->assertHeader('Content-Type', 'image/png')
            ->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertStringContainsString('max-age=31536000', (string) $response->headers->get('Cache-Control'));
        $this->assertStringContainsString('immutable', (string) $response->headers->get('Cache-Control'));
        $this->assertSame("\x89PNG\r\n\x1a\n", substr($response->getContent(), 0, 8));
    }

    public function test_signed_url_can_store_the_image_on_the_configured_shared_disk(): void
    {
        config(['og.cache_disk' => 's3']);
        Storage::fake('s3');

        $url = app(OgImageUrlGenerator::class)->generate('article', 'Título Unicode');
        $path = parse_url((string) $url, PHP_URL_PATH);

        $this->get((string) $path)->assertOk();

        $this->assertCount(1, Storage::disk('s3')->allFiles('framework/testing/og'));
    }

    public function test_tampered_signature_is_rejected_before_rendering(): void
    {
        $url = app(OgImageUrlGenerator::class)->generate('article', 'Title');
        $path = (string) parse_url((string) $url, PHP_URL_PATH);
        $tampered = Str::replaceEnd('.png', 'x.png', $path);

        $this->get($tampered)->assertForbidden();
    }

    public function test_oversized_payload_is_rejected_before_signature_validation(): void
    {
        $payload = str_repeat('a', (int) config('og.max_payload_bytes') + 1);

        $this->get('/og/'.$payload.'/invalid.png')->assertStatus(413);
    }

    public function test_disabled_generation_is_not_cached_by_a_proxy(): void
    {
        config(['og.enabled' => false]);

        $response = $this->get('/og/valid-payload/valid-signature.png')->assertNotFound();

        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
    }
}
