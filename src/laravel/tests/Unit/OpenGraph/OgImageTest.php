<?php

namespace Tests\Unit\OpenGraph;

use App\OpenGraph\OgImageRenderer;
use App\OpenGraph\OgPayload;
use Tests\TestCase;

final class OgImageTest extends TestCase
{
    public function test_renderer_returns_a_png(): void
    {
        $contents = app(OgImageRenderer::class)->render(
            new OgPayload(1, 'article', 'Título Unicode', 'Descrição longa'),
        );

        $this->assertSame("\x89PNG\r\n\x1a\n", substr($contents, 0, 8));
        $this->assertGreaterThan(1000, strlen($contents));
    }
}
