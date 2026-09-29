<?php

namespace Tests\Unit\Content;

use App\Content\OpenGraphMetadata;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OpenGraphMetadataTest extends TestCase
{
    public function test_metadata_is_parsed_and_cached(): void
    {
        Http::fake([
            'https://1.1.1.1/*' => Http::response(
                '<html><head><title>Fallback title</title><meta property="og:title" content="Portfolio"><meta property="og:description" content="A site"><meta property="og:image" content="/preview.png"></head></html>',
                200,
                ['Content-Type' => 'text/html; charset=UTF-8'],
            ),
        ]);

        $service = app(OpenGraphMetadata::class);
        $url = 'https://1.1.1.1/guesant/portfolio';

        $first = $service->forUrl($url);
        $this->assertNull($first);

        $service->refresh($url);
        $second = $service->forUrl($url);

        $this->assertNull($first);
        $this->assertSame([
            'title' => 'Portfolio',
            'description' => 'A site',
            'image' => 'https://1.1.1.1/preview.png',
        ], $second);
        Http::assertSentCount(1);
    }
}
