<?php

namespace Tests\Feature\Api;

use App\Application\PublicSite\GetPublicSiteChromeQueryHandler;
use App\Content\EditorialRevisionPublisher;
use App\Content\PublicSiteChromeCache;
use App\Events\PublicSiteContentChanged;
use App\Jobs\WarmPublicSiteChrome;
use App\Listeners\InvalidatePublicSiteChrome;
use App\Models\CaseStudy;
use App\Models\CaseStudyRevisionTranslation;
use App\Models\Page;
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

    public function test_site_chrome_builds_from_database_and_writes_cache(): void
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
        $this->assertStringNotContainsString(
            '"label"',
            json_encode($response->json('navigation'), JSON_THROW_ON_ERROR),
        );
        $response->assertHeader('X-Public-Site-Cache', 'miss');
        $this->assertTrue(Cache::has(app(PublicSiteChromeCache::class)->key('en')));

        $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->assertHeader('X-Public-Site-Cache', 'hit');
    }

    public function test_home_page_returns_server_computed_recurring_technologies(): void
    {
        $page = Page::factory()->create(['slug' => 'home']);
        app(EditorialRevisionPublisher::class)->publish($page, [
            'en' => ['title' => 'Home'],
        ]);

        $this->getJson('/api/v1/site/pages/home?locale=en')
            ->assertOk()
            ->assertJsonPath('recurringTechnologies', []);
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
                app(GetPublicSiteChromeQueryHandler::class),
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

    public function test_finding_identifier_keeps_working_after_slug_changes(): void
    {
        $resource = $this->createResource('old-finding-slug');
        $revision = $resource->refresh()->currentRevision;
        $identifier = $revision->public_id.'-old-finding-slug';

        $revision->update(['slug' => 'new-finding-slug']);

        $this->getJson("/api/v1/findings/{$identifier}?locale=en")
            ->assertOk()
            ->assertJsonPath('slug', 'new-finding-slug')
            ->assertJsonPath('url', "/findings/{$revision->public_id}-new-finding-slug");
    }

    public function test_home_feed_is_paginated_and_server_ordered(): void
    {
        $this->createResource('first-feed-finding');

        $response = $this->getJson('/api/v1/content/feed?locale=en&per_page=1&kind=achado');

        $response
            ->assertOk()
            ->assertJsonPath('meta.page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 1)
            ->assertJsonPath('data.0.kind', 'achado')
            ->assertJsonCount(1, 'data');
    }

    public function test_home_gallery_returns_server_ordered_sections(): void
    {
        $response = $this->getJson('/api/v1/site/home-gallery?locale=en');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'highlights',
                'recent' => ['writing', 'finding', 'collection'],
                'popular' => ['writing', 'finding', 'collection'],
                'portfolio' => [
                    'cases',
                    'projects',
                    'experiments',
                    'collections',
                    'snippets',
                    'technologies',
                    'topics',
                    'credits',
                ],
                'collection_showcases',
            ]);

        foreach (['recent', 'popular'] as $group) {
            foreach (['writing', 'finding', 'collection'] as $kind) {
                $this->assertLessThanOrEqual(6, count($response->json("{$group}.{$kind}")));
            }
        }
        foreach (
            ['cases', 'projects', 'experiments', 'collections', 'snippets', 'technologies', 'topics', 'credits'] as $kind
        ) {
            $this->assertLessThanOrEqual(6, count($response->json("portfolio.{$kind}")));
        }
        foreach ($response->json('collection_showcases') as $showcase) {
            $this->assertLessThanOrEqual(6, count($showcase['items']));
        }
    }

    public function test_home_gallery_returns_items_for_each_visible_collection(): void
    {
        $collection = ReferenceCollection::factory()->create([
            'slug' => 'reading-list',
            'hidden' => false,
        ]);
        ReferenceCollectionRevisionTranslation::factory()->create([
            'reference_collection_id' => $collection->id,
            'locale' => 'en',
        ]);
        $resource = $this->createResource('collection-finding');
        $collection->resources()->attach($resource, ['order' => 1]);

        $this->getJson('/api/v1/site/home-gallery?locale=en')
            ->assertOk()
            ->assertJsonPath('collection_showcases.0.collection.slug', 'reading-list')
            ->assertJsonCount(1, 'collection_showcases.0.items');
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
