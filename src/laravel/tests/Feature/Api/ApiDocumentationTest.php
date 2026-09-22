<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class ApiDocumentationTest extends TestCase
{
    public function test_scalar_documentation_is_available_at_docs(): void
    {
        $this->get('/docs')
            ->assertOk()
            ->assertSee('@scalar/api-reference');
    }

    public function test_swagger_documentation_is_available_at_both_urls(): void
    {
        foreach (['/docs/swagger', '/docs/swagger/', '/docs/swagger/index.html', '/docs/swagger/index.html/'] as $path) {
            $this->get($path)
                ->assertOk()
                ->assertSee('SwaggerUIBundle');
        }
    }

    public function test_openapi_document_is_generated_from_laravel_routes(): void
    {
        $this->getJson('/docs/openapi.json')
            ->assertOk()
            ->assertJsonPath('openapi', '3.1.0')
            ->assertJsonPath('info.title', 'Guesant public API')
            ->assertJsonStructure([
                'openapi',
                'info',
                'servers',
                'paths',
            ])
            ->assertJsonPath('paths./site/chrome.get', fn ($value): bool => is_array($value));
    }
}
