<?php

namespace Tests\Feature\Api;

use App\Models\CaseStudy;
use App\Models\CaseStudyTranslation;
use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionTranslation;
use App\Models\Resource;
use App\Models\ResourceTranslation;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PublicSiteApiTest extends TestCase
{
    public function test_site_chrome_builds_from_database_without_cache(): void
    {
        Cache::flush();

        $response = $this->getJson('/api/v1/site/chrome?locale=en');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'site',
                'profile',
                'copyright',
                'navigation',
                'build',
                'visibility',
            ]);
    }

    public function test_content_collection_returns_a_paginated_page(): void
    {
        $this->createCaseStudy('first-case');
        $this->createCaseStudy('second-case');

        $response = $this->getJson('/api/v1/content/cases?locale=en&per_page=1');

        $response
            ->assertOk()
            ->assertJsonPath('meta.page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonCount(1, 'data');
    }

    public function test_findings_returns_a_paginated_page(): void
    {
        $this->createResource('first-finding');
        $this->createResource('second-finding');

        $response = $this->getJson('/api/v1/findings?locale=en&per_page=1');

        $response
            ->assertOk()
            ->assertJsonPath('meta.page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonCount(1, 'data');
    }

    public function test_collection_detail_returns_a_paginated_resource_page(): void
    {
        $collection = ReferenceCollection::factory()->create([
            'slug' => 'reading-list',
            'hidden' => false,
        ]);
        ReferenceCollectionTranslation::factory()->create([
            'reference_collection_id' => $collection->id,
            'locale' => 'en',
        ]);

        $first = $this->createResource('first-collection-finding');
        $second = $this->createResource('second-collection-finding');
        $collection->resources()->attach($first, ['order' => 1]);
        $collection->resources()->attach($second, ['order' => 2]);

        $response = $this->getJson('/api/v1/content/collections/reading-list?locale=en&per_page=1');

        $response
            ->assertOk()
            ->assertJsonPath('resources_meta.page', 1)
            ->assertJsonPath('resources_meta.per_page', 1)
            ->assertJsonPath('resources_meta.total', 2)
            ->assertJsonPath('resources_meta.last_page', 2)
            ->assertJsonCount(1, 'resources');
    }

    private function createCaseStudy(string $slug): CaseStudy
    {
        $case = CaseStudy::factory()->create([
            'slug' => $slug,
            'hidden' => false,
            'nda' => false,
        ]);

        CaseStudyTranslation::factory()->create([
            'case_study_id' => $case->id,
            'locale' => 'en',
        ]);

        return $case;
    }

    private function createResource(string $slug): Resource
    {
        $resource = Resource::factory()->create([
            'slug' => $slug,
            'hidden' => false,
            'visibility' => 'public',
        ]);

        ResourceTranslation::factory()->create([
            'resource_id' => $resource->id,
            'locale' => 'en',
        ]);

        return $resource;
    }
}
