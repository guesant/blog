<?php

namespace Tests\Feature\Api;

use App\Application\PublicSite\GetPublicPageQueryResult;
use App\Application\PublicSite\GetPublicSiteChromeQueryHandler;
use App\Content\EditorialRevisionPublisher;
use App\Content\PublicSiteChromeCache;
use App\Events\PublicSiteContentChanged;
use App\Http\Responses\PublicPageResponseDto;
use App\Jobs\WarmPublicSiteChrome;
use App\Listeners\InvalidatePublicSiteChrome;
use App\Models\CaseStudy;
use App\Models\CaseStudyRevisionTranslation;
use App\Models\MediaAsset;
use App\Models\NavItem;
use App\Models\Page;
use App\Models\PageRevisionTranslation;
use App\Models\Profile;
use App\Models\ProfileRevisionTranslation;
use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionRevisionTranslation;
use App\Models\Resource;
use App\Models\ResourceRevisionTranslation;
use App\Models\Resume;
use App\Models\ResumeRevisionTranslation;
use App\Models\SidebarGroup;
use App\Models\SiteSettings;
use App\Models\Writing;
use App\Models\WritingRevisionTranslation;
use App\OpenGraph\OgImageUrlGenerator;
use App\Support\AdminMediaUrl;
use App\Support\PublicMediaSignature;
use App\Support\PublicMediaUrl;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PublicSiteApiTest extends TestCase
{
    public function test_public_media_serves_only_content_attachments(): void
    {
        config(['filesystems.default' => 's3']);
        config([
            'portfolio.media_url_signing_key' => 'test-media-signing-key',
            'portfolio.media_url_ttl_seconds' => 300,
        ]);
        Storage::fake('s3');
        Storage::disk('s3')->put('content-attachments/example.txt', 'public attachment');
        MediaAsset::factory()->create([
            'disk' => 's3',
            'path' => 'content-attachments/example.txt',
            'mime_type' => 'text/plain',
        ]);

        $signedUrl = app(PublicMediaUrl::class)->url('content-attachments/example.txt');
        $this->assertNotNull($signedUrl);
        $parts = parse_url($signedUrl);
        $response = $this->get($parts['path'].'?'.$parts['query'])
            ->assertOk()
            ->assertHeader('Content-Disposition', 'attachment');

        parse_str((string) $parts['query'], $query);
        $query['inline'] = '1';
        $this->get($parts['path'].'?'.http_build_query($query))
            ->assertOk()
            ->assertHeader('Content-Disposition', 'attachment');

        $this->assertSame('public attachment', $response->streamedContent());
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->assertMatchesRegularExpression(
            '/^max-age=\d+, public$/',
            (string) $response->headers->get('Cache-Control'),
        );

        $this->get('/api/v1/media/content-attachments/example.txt')->assertNotFound();
        $this->get('/api/v1/media/private.txt')->assertNotFound();
    }

    public function test_markdown_media_urls_can_render_images_without_changing_direct_downloads(): void
    {
        config([
            'filesystems.default' => 's3',
            'portfolio.media_url_signing_key' => 'test-media-signing-key',
        ]);
        Storage::fake('s3');
        Storage::disk('s3')->put('content-attachments/example.png', 'public image');
        MediaAsset::factory()->create([
            'disk' => 's3',
            'path' => 'content-attachments/example.png',
        ]);

        $directUrl = app(PublicMediaUrl::class)->url('content-attachments/example.png');
        $inlineUrl = app(PublicMediaUrl::class)->url('content-attachments/example.png', null, true);
        $this->assertNotNull($directUrl);
        $this->assertNotNull($inlineUrl);
        $this->assertStringNotContainsString('inline=1', (string) $directUrl);
        $this->assertStringContainsString('inline=1', (string) $inlineUrl);

        $direct = parse_url($directUrl);
        $this->get($direct['path'].'?'.$direct['query'])
            ->assertOk()
            ->assertHeader('Content-Disposition', 'attachment');

        $inline = parse_url($inlineUrl);
        $this->get($inline['path'].'?'.$inline['query'])
            ->assertOk()
            ->assertHeader('Content-Disposition', 'inline');
    }

    public function test_admin_markdown_media_urls_request_inline_images(): void
    {
        $asset = MediaAsset::factory()->create();

        $url = app(AdminMediaUrl::class)->forAsset($asset, true);

        $this->assertStringContainsString('/media/'.$asset->id.'/download?inline=1', $url);
    }

    public function test_public_media_rejects_expired_and_tampered_signatures(): void
    {
        config(['portfolio.media_url_signing_key' => 'test-media-signing-key']);
        Storage::fake('s3');
        config(['filesystems.default' => 's3']);
        Storage::disk('s3')->put('content-attachments/example.txt', 'public attachment');
        MediaAsset::factory()->create([
            'disk' => 's3',
            'path' => 'content-attachments/example.txt',
        ]);

        $expiredUrl = app(PublicMediaUrl::class)->url('content-attachments/example.txt', time() - 1);
        $this->assertNotNull($expiredUrl);
        $expired = parse_url($expiredUrl);
        $this->get($expired['path'].'?'.$expired['query'])->assertNotFound();

        $signedUrl = app(PublicMediaUrl::class)->url('content-attachments/example.txt');
        $this->assertNotNull($signedUrl);
        $parts = parse_url($signedUrl);
        parse_str($parts['query'], $query);
        $query['signature'] = str_repeat('0', 64);

        $this->get($parts['path'].'?'.http_build_query($query))->assertNotFound();
    }

    public function test_private_media_is_not_signed_or_served_publicly(): void
    {
        config([
            'filesystems.default' => 's3',
            'portfolio.media_url_signing_key' => 'test-media-signing-key',
        ]);
        Storage::fake('s3');
        Storage::disk('s3')->put('content-attachments/private.txt', 'private attachment');
        MediaAsset::factory()->create([
            'disk' => 's3',
            'path' => 'content-attachments/private.txt',
            'visibility' => 'private',
        ]);

        $this->assertNull(app(PublicMediaUrl::class)->url('content-attachments/private.txt'));

        $expiresAt = time() + 300;
        $signature = app(PublicMediaSignature::class)->sign(
            's3',
            'content-attachments/private.txt',
            $expiresAt,
        );

        $this->get('/api/v1/media/content-attachments/private.txt?'.http_build_query([
            'disk' => 's3',
            'expires' => $expiresAt,
            'signature' => $signature,
        ]))->assertNotFound();
    }

    public function test_public_media_accepts_the_previous_signing_key_during_rotation(): void
    {
        config([
            'filesystems.default' => 's3',
            'portfolio.media_url_signing_key' => 'new-media-signing-key',
            'portfolio.media_url_previous_signing_key' => 'old-media-signing-key',
        ]);
        Storage::fake('s3');
        Storage::disk('s3')->put('content-attachments/example.txt', 'public attachment');
        MediaAsset::factory()->create([
            'disk' => 's3',
            'path' => 'content-attachments/example.txt',
        ]);

        $expiresAt = time() + 300;
        $signature = hash_hmac(
            'sha256',
            "GET\n{$expiresAt}\ns3\ncontent-attachments/example.txt",
            'old-media-signing-key',
        );

        $this->get('/api/v1/media/content-attachments/example.txt?'.http_build_query([
            'disk' => 's3',
            'expires' => $expiresAt,
            'signature' => $signature,
        ]))->assertOk();
    }

    public function test_public_media_rewrite_does_not_expose_storage_urls(): void
    {
        config([
            'filesystems.default' => 's3',
            'portfolio.media_url_signing_key' => 'test-media-signing-key',
        ]);
        Storage::fake('s3');
        Storage::disk('s3')->put('content-attachments/example.png', 'public attachment');
        MediaAsset::factory()->create([
            'disk' => 's3',
            'path' => 'content-attachments/example.png',
        ]);

        $rewritten = app(PublicMediaUrl::class)->rewrite(
            '![Example](https://silo.guesant.internal/portfolio/content-attachments/example.png)',
        );

        $this->assertIsString($rewritten);
        $this->assertStringContainsString('/api/v1/media/content-attachments/example.png?', $rewritten);
        $this->assertStringContainsString('inline=1', $rewritten);
        $this->assertStringNotContainsString('silo.guesant.internal', $rewritten);

        $adminRewritten = app(PublicMediaUrl::class)->rewrite(
            '![Example](https://admin.guesant.net/admin/media/'.MediaAsset::query()->firstOrFail()->id.'/download)',
        );

        $this->assertIsString($adminRewritten);
        $this->assertStringContainsString('/api/v1/media/content-attachments/example.png?', $adminRewritten);
        $this->assertStringContainsString('inline=1', $adminRewritten);
        $this->assertStringNotContainsString('admin.guesant.net', $adminRewritten);
    }

    public function test_public_api_data_routes_are_blocked_during_maintenance(): void
    {
        SiteSettings::factory()->create(['maintenance_enabled' => true]);

        $this->getJson('/api/v1/site/pages/home')
            ->assertStatus(503)
            ->assertJsonPath('error.code', 'maintenance');

        $this->getJson('/api/v1/media/content-attachments/missing.png')
            ->assertStatus(503)
            ->assertJsonPath('error.code', 'maintenance');

        $this->postJson('/api/v1/protected-email/challenge')
            ->assertStatus(503)
            ->assertJsonPath('error.code', 'maintenance');
    }

    public function test_follow_page_publishes_available_feed_entries(): void
    {
        PageRevisionTranslation::factory()->create([
            'page_id' => Page::factory()->create(['slug' => 'follow'])->id,
            'locale' => 'en',
            'rss_title' => 'RSS',
            'rss_description' => 'RSS feed',
            'jsonfeed_title' => 'JSON Feed',
        ]);

        $this->getJson('/api/v1/site/pages/follow?locale=en')
            ->assertOk()
            ->assertJsonPath('entries.0.key', 'rss')
            ->assertJsonPath('entries.0.title', 'RSS')
            ->assertJsonPath('entries.0.description', 'RSS feed')
            ->assertJsonPath('entries.1.key', 'jsonfeed')
            ->assertJsonPath('entries.1.title', 'JSON Feed');
    }

    public function test_public_page_response_does_not_return_unlisted_fields(): void
    {
        $response = PublicPageResponseDto::fromResult(
            new GetPublicPageQueryResult('home', 'en', [
                'title' => 'Home',
                'description' => 'Public description',
                'privateSecret' => 'must not be returned',
            ]),
            app(OgImageUrlGenerator::class),
            app(PublicMediaUrl::class),
        );

        $this->assertSame([
            'title' => 'Home',
            'description' => 'Public description',
            'og_image_url' => app(OgImageUrlGenerator::class)->generate('profile', 'Home', 'Public description'),
        ], $response->toArray());
    }

    public function test_disabled_contact_does_not_issue_a_protected_email_challenge(): void
    {
        SiteSettings::factory()->create([
            'maintenance_enabled' => false,
            'contact_enabled' => false,
            'contact_email' => 'contact@example.com',
        ]);

        $this->postJson('/api/v1/protected-email/challenge')
            ->assertOk()
            ->assertJson([]);
    }

    public function test_private_navigation_routes_are_not_published(): void
    {
        $group = SidebarGroup::query()->firstOrCreate(
            ['key' => 'private-test'],
            ['order' => 99, 'active' => true],
        );

        $this->createPublishedNavItem([
            'route_name' => 'filament.admin.pages.dashboard',
            'parent_id' => null,
            'placement' => 'sidebar',
            'sidebar_group_id' => $group->id,
            'order' => 0,
        ]);

        $navigation = $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->json('navigation');

        $this->assertStringNotContainsString(
            'filament',
            json_encode($navigation, JSON_THROW_ON_ERROR),
        );
    }

    public function test_feed_page_is_not_published_in_the_content_sidebar_group(): void
    {
        Cache::flush();
        $groups = collect($this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->json('navigation.sidebar'));
        $items = $groups->flatMap(static fn (array $group): array => $group['items'] ?? []);

        $this->assertNotContains('/feed', array_column($items->all(), 'route'));
    }

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
                'navigation' => [
                    'sidebar',
                    'footer_links',
                    'sitemap',
                ],
                'build',
                'visibility',
            ]);
        $this->assertIsArray($response->json('navigation.sidebar'));
        foreach ($response->json('navigation.sidebar') as $group) {
            $this->assertArrayHasKey('key', $group);
            $this->assertArrayHasKey('label', $group);
            $this->assertArrayHasKey('items', $group);
        }
        $this->assertArrayNotHasKey('birth_date', $response->json('profile') ?? []);
        $this->assertArrayNotHasKey('birth_city', $response->json('profile') ?? []);
        $response->assertHeader('X-Public-Site-Cache', 'miss');
        $response->assertHeader('Cache-Control', 'must-revalidate, no-cache, public');
        $this->assertTrue(Cache::has(app(PublicSiteChromeCache::class)->key('en')));

        $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->assertHeader('X-Public-Site-Cache', 'hit');
    }

    public function test_sidebar_group_labels_are_published_from_the_selected_locale(): void
    {
        Cache::flush();
        $group = SidebarGroup::query()->create([
            'key' => 'editorial-test',
            'order' => 99,
            'active' => true,
        ]);
        $group->translations()->createMany([
            ['locale' => 'en', 'label' => 'Editorial'],
            ['locale' => 'pt-BR', 'label' => 'Editorial em português'],
        ]);
        $this->createPublishedNavItem([
            'route_name' => 'writing.show',
            'parent_id' => null,
            'placement' => 'sidebar',
            'sidebar_group_id' => $group->id,
            'order' => 0,
        ]);

        $englishGroups = collect($this->getJson('/api/v1/site/chrome?locale=en')->json('navigation.sidebar'));
        $portugueseGroups = collect($this->getJson('/api/v1/site/chrome?locale=pt-BR')->json('navigation.sidebar'));

        $this->assertSame('Editorial', $englishGroups->firstWhere('key', 'editorial-test')['label']);
        $this->assertSame(
            'Editorial em português',
            $portugueseGroups->firstWhere('key', 'editorial-test')['label'],
        );
    }

    public function test_site_chrome_returns_maintenance_state_without_blocking_the_shell(): void
    {
        Cache::flush();
        SiteSettings::factory()->create(['maintenance_enabled' => true]);

        $response = $this->getJson('/api/v1/site/chrome?locale=en');

        $response
            ->assertOk()
            ->assertJsonPath('site.maintenance_enabled', true);
        $this->assertStringContainsString('no-store', (string) $response->headers->get('Cache-Control'));
    }

    public function test_site_chrome_exposes_feature_flags_from_site_settings(): void
    {
        Cache::flush();
        SiteSettings::factory()->create([
            'content_actions_copy_text' => true,
            'content_actions_copy_url' => true,
            'content_actions_download_text' => false,
            'contextual_cursor_enabled' => true,
            'feed_flat_cards_enabled' => false,
        ]);

        $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->assertJsonPath('site.feature_flags.content_actions.copy_text', true)
            ->assertJsonPath('site.feature_flags.content_actions.copy_url', true)
            ->assertJsonPath('site.feature_flags.content_actions.download_text', false)
            ->assertJsonPath('site.feature_flags.contextual_cursor', true)
            ->assertJsonPath('site.feature_flags.feed.flat_cards', false);
    }

    public function test_contact_visibility_is_independent_from_opportunity_availability(): void
    {
        Cache::flush();
        SiteSettings::factory()->create([
            'contact_enabled' => true,
            'contact_available' => false,
            'contact_email' => 'contact@example.com',
        ]);

        $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->assertJsonPath('site.contact_enabled', true)
            ->assertJsonPath('site.contact_email_available', true)
            ->assertJsonPath('site.contact_available', false)
            ->assertJsonPath('visibility.contact', true)
            ->assertJsonPath('visibility.right_sidebar', true);
    }

    public function test_disabled_contact_is_hidden_even_when_opportunities_are_available(): void
    {
        Cache::flush();
        SiteSettings::factory()->create([
            'contact_enabled' => false,
            'contact_available' => true,
            'contact_email' => 'contact@example.com',
        ]);

        $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->assertJsonPath('site.contact_enabled', false)
            ->assertJsonPath('site.contact_available', true)
            ->assertJsonPath('visibility.contact', false)
            ->assertJsonPath('visibility.right_sidebar', false);
    }

    public function test_site_chrome_hides_profile_when_published_revision_is_hidden(): void
    {
        Cache::flush();
        $profile = Profile::factory()->create(['name' => 'Gabriel R. Antunes']);
        ProfileRevisionTranslation::factory()->create([
            'profile_id' => $profile->id,
            'locale' => 'en',
        ]);
        $profile->refresh()->publishedRevision()->update(['hidden' => true]);

        $response = $this->getJson('/api/v1/site/chrome?locale=en')
            ->assertOk()
            ->assertJsonPath('profile', null)
            ->assertJsonPath('visibility.about', false);
    }

    private function createPublishedNavItem(array $attributes): NavItem
    {
        $item = NavItem::query()->create($attributes);
        app(EditorialRevisionPublisher::class)->publish($item, []);

        return $item->refresh();
    }

    public function test_home_page_returns_server_computed_recurring_technologies(): void
    {
        config()->set([
            'og.enabled' => true,
            'og.secret' => 'test-og-secret',
            'og.base_url' => 'https://api.example.test',
        ]);

        $page = Page::factory()->create(['slug' => 'home']);
        app(EditorialRevisionPublisher::class)->publish($page, [
            'en' => [
                'title' => 'Home',
                'description' => 'The home page.',
            ],
        ]);

        $response = $this->getJson('/api/v1/site/pages/home?locale=en')
            ->assertOk()
            ->assertJsonPath('title', 'Home')
            ->assertJsonPath('description', 'The home page.')
            ->assertJsonPath('og_image_url', fn (mixed $value): bool => is_string($value) && $value !== '')
            ->assertJsonPath('recurringTechnologies', []);

        $this->assertArrayNotHasKey('seo', $response->json());
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

        PublicSiteContentChanged::dispatch();
        (new InvalidatePublicSiteChrome)->handle(new PublicSiteContentChanged, $cache);

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

        $response = $this->getJson('/api/v1/content/feed?locale=en&per_page=1&kind=achado');

        $response
            ->assertOk()
            ->assertJsonPath('meta.page', 1)
            ->assertJsonPath('meta.per_page', 1)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.last_page', 2)
            ->assertJsonPath('data.0.kind', 'achado')
            ->assertJsonCount(1, 'data');
    }

    public function test_writing_collection_and_findings_list_endpoints_are_not_public(): void
    {
        $this->getJson('/api/v1/content/writing?locale=en')->assertNotFound();
        $this->getJson('/api/v1/content/collections?locale=en')->assertNotFound();
        $this->getJson('/api/v1/findings?locale=en')->assertNotFound();
    }

    public function test_hidden_resume_revision_is_not_returned_by_the_public_api(): void
    {
        $resume = Resume::factory()->create();
        ResumeRevisionTranslation::factory()->create([
            'resume_id' => $resume->id,
            'locale' => 'en',
            'summary' => 'Private summary',
        ]);
        $resume->refresh()->currentRevision()->update(['hidden' => true]);

        $this->getJson('/api/v1/site/resume?locale=en')
            ->assertOk()
            ->assertJsonPath('summary', null)
            ->assertJsonPath('selected_cases', [])
            ->assertJsonPath('skills', [])
            ->assertJsonPath('languages', []);
    }

    public function test_hidden_resume_rows_are_not_returned_by_the_public_api(): void
    {
        $resume = Resume::factory()->create();
        $translation = ResumeRevisionTranslation::factory()->create([
            'resume_id' => $resume->id,
            'locale' => 'en',
            'summary' => 'Public summary',
        ]);
        DB::table('resume_revision_education')->insert([
            'resume_revision_translation_id' => $translation->id,
            'institution' => 'Hidden institution',
            'hidden' => true,
            'sort_order' => 1,
        ]);
        DB::table('resume_revision_education')->insert([
            'resume_revision_translation_id' => $translation->id,
            'institution' => 'Visible institution',
            'hidden' => false,
            'sort_order' => 2,
        ]);

        $this->getJson('/api/v1/site/resume?locale=en')
            ->assertOk()
            ->assertJsonCount(1, 'education')
            ->assertJsonPath('education.0.institution', 'Visible institution');
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
            ->assertJsonMissingPath('data.0.og_image_url')
            ->assertJsonCount(1, 'data');
    }

    public function test_home_gallery_returns_server_ordered_sections(): void
    {
        $response = $this->getJson('/api/v1/site/home-gallery?locale=en');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'highlights',
                'feed',
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
                'totals' => [
                    'highlights',
                    'feed',
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
                ],
            ]);

        $this->assertArrayNotHasKey('recent', $response->json());
        $this->assertArrayNotHasKey('popular', $response->json());
        $this->assertLessThanOrEqual(15, count($response->json('feed')));
        foreach (
            ['cases', 'projects', 'experiments', 'collections', 'snippets', 'technologies', 'topics', 'credits'] as $kind
        ) {
            $this->assertLessThanOrEqual(6, count($response->json("portfolio.{$kind}")));
        }
        foreach ($response->json('collection_showcases') as $showcase) {
            $this->assertLessThanOrEqual(6, count($showcase['items']));
        }
    }

    public function test_home_gallery_returns_totals_for_limited_sections(): void
    {
        foreach (range(1, 16) as $index) {
            $this->createResource("home-gallery-finding-{$index}");
        }

        $this->getJson('/api/v1/site/home-gallery?locale=en')
            ->assertOk()
            ->assertJsonCount(15, 'feed')
            ->assertJsonPath('totals.feed', 16);
    }

    public function test_home_gallery_feed_mixes_published_content_in_date_order(): void
    {
        $writing = Writing::factory()->create([
            'hidden' => false,
            'date_iso' => '2026-09-03',
        ]);
        WritingRevisionTranslation::factory()->create([
            'writing_id' => $writing->id,
            'locale' => 'en',
        ]);
        $writing->publishedRevision()->update(['date_iso' => '2026-09-03']);

        $this->createResource('mixed-feed-finding', [
            'found_date_iso' => '2026-09-02',
            'published_date_iso' => '2026-09-02',
        ]);

        $collection = ReferenceCollection::factory()->create([
            'hidden' => false,
            'published_at' => '2026-09-01',
        ]);
        ReferenceCollectionRevisionTranslation::factory()->create([
            'reference_collection_id' => $collection->id,
            'locale' => 'en',
        ]);
        $collection->publishedRevision()->update(['published_at' => '2026-09-01']);

        $response = $this->getJson('/api/v1/site/home-gallery?locale=en')->assertOk();
        $feed = $response->json('feed');

        $this->assertSame(['post', 'achado', 'colecao'], array_column($feed, 'kind'));
    }

    public function test_writing_body_is_the_only_editorial_text_field(): void
    {
        $body = '**Intro** [link](https://example.com) '.str_repeat('word ', 60);
        $writing = Writing::factory()->create([
            'slug' => 'description-source',
            'hidden' => false,
        ]);
        WritingRevisionTranslation::factory()->create([
            'writing_id' => $writing->id,
            'locale' => 'en',
            'title' => 'Description source',
            'body' => $body,
        ]);

        $listItem = $this->getJson('/api/v1/content/feed?locale=en&per_page=1&kind=post')
            ->assertOk()
            ->json('data.0');
        $this->assertArrayNotHasKey('body', $listItem);
        $this->assertLessThanOrEqual(350, mb_strlen((string) $listItem['preview']));
        $this->assertStringNotContainsString('https://example.com', $listItem['preview']);

        $this->getJson('/api/v1/content/writing/description-source?locale=en')
            ->assertOk()
            ->assertJsonPath('body', $body)
            ->assertJsonMissingPath('excerpt');
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

    private function createResource(string $slug, array $attributes = []): Resource
    {
        $resource = Resource::factory()->create([
            'slug' => $slug,
            ...$attributes,
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
