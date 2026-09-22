<?php

namespace Tests\Feature\Api;

use App\Application\PublicSite\GetPublicSiteChromeHandler;
use App\Content\PublicSiteChromeCache;
use App\Events\PublicSiteContentChanged;
use App\Jobs\WarmPublicSiteChrome;
use App\Listeners\InvalidatePublicSiteChrome;
use App\Models\CaseStudy;
use App\Models\CaseStudyRevisionTranslation;
use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionRevisionTranslation;
use App\Models\Resource;
use App\Models\ResourceRevisionTranslation;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PublicSiteApiTest extends TestCase
{
    public function test_static_interface_catalog_is_not_an_api_resource(): void
    {
        $this->getJson('/api/v1/site/interface?locale=en')->assertNotFound();
    }

    public function test_site_chrome_builds_from_database_without_writing_cache(): void
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
        $response->assertHeader('X-Public-Site-Cache', 'miss');
        $this->assertFalse(Cache::has(app(PublicSiteChromeCache::class)->key('en')));
    }

    public function test_site_chrome_uses_cache_without_building_the_query(): void
    {
        $data = [
            'site' => ['maintenance_enabled' => false],
            'profile' => null,
            'copyright' => 'Portfolio',
            'navigation' => [],
            'build' => [],
            'visibility' => [],
        ];
        app(PublicSiteChromeCache::class)->put('en', $data);
        $queries = [];
        DB::listen(function (QueryExecuted $query) use (&$queries): void {
            $queries[] = $query->sql;
        });

        $response = $this->getJson('/api/v1/site/chrome?locale=en');

        $response
            ->assertOk()
            ->assertHeader('X-Public-Site-Cache', 'hit')
            ->assertJson($data);
        $contentQueries = array_values(array_filter(
            $queries,
            static fn (string $query): bool => preg_match(
                '/site_settings|nav_items|profiles|resources|writings/i',
                $query,
            ) === 1,
        ));

        $this->assertSame([], $contentQueries);
    }

    public function test_site_chrome_uses_public_read_queries_without_detail_relations(): void
    {
        Cache::flush();
        $queries = [];

        DB::listen(function (QueryExecuted $query) use (&$queries): void {
            $queries[] = strtolower($query->sql);
        });

        $response = $this->getJson('/api/v1/site/chrome?locale=en');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'site',
                'profile',
                'copyright',
                'navigation',
                'build',
                'visibility' => [
                    'about',
                    'resume',
                    'portfolio',
                    'cases',
                    'contact',
                    'license',
                    'credits',
                    'follow',
                    'feed',
                    'writing',
                    'findings',
                    'topics',
                    'collections',
                    'snippets',
                    'right_sidebar',
                ],
            ]);

        $joinedQueries = implode(' ', $queries);

        foreach ([
            'resume_selected_case',
            'resume_skills',
            'resume_languages',
            'page_revision_featured',
            'page_featured_case',
            'page_featured_project',
            'page_featured_writing',
        ] as $forbiddenTable) {
            $this->assertStringNotContainsString($forbiddenTable, $joinedQueries);
        }

        $this->assertLessThan(30, count($queries));
    }

    public function test_site_chrome_warm_job_writes_each_locale(): void
    {
        Cache::flush();

        foreach (['en', 'pt-BR'] as $locale) {
            (new WarmPublicSiteChrome($locale))->handle(
                app(PublicSiteChromeCache::class),
                app(GetPublicSiteChromeHandler::class),
            );
        }

        $cache = app(PublicSiteChromeCache::class);
        $this->assertTrue(Cache::has($cache->key('en')));
        $this->assertTrue(Cache::has($cache->key('pt-BR')));
    }

    public function test_site_chrome_invalidation_forgets_cache_and_queues_warm_jobs(): void
    {
        Queue::fake();
        $cache = app(PublicSiteChromeCache::class);
        $cache->put('en', ['site' => []]);
        $cache->put('pt-BR', ['site' => []]);

        (new InvalidatePublicSiteChrome)->handle(new PublicSiteContentChanged);

        $this->assertFalse(Cache::has($cache->key('en')));
        $this->assertFalse(Cache::has($cache->key('pt-BR')));
        Queue::assertPushed(WarmPublicSiteChrome::class, 2);
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
        ReferenceCollectionRevisionTranslation::factory()->create([
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

        CaseStudyRevisionTranslation::factory()->create([
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

        ResourceRevisionTranslation::factory()->create([
            'resource_id' => $resource->id,
            'locale' => 'en',
        ]);

        return $resource;
    }
}
