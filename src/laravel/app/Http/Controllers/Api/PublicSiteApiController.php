<?php

namespace App\Http\Controllers\Api;

use App\Application\PublicSite\GetPublicContentQuery;
use App\Application\PublicSite\GetPublicContentQueryHandler;
use App\Application\PublicSite\GetPublicEmailChallengeQuery;
use App\Application\PublicSite\GetPublicEmailChallengeQueryHandler;
use App\Application\PublicSite\GetPublicHomeGalleryQuery;
use App\Application\PublicSite\GetPublicHomeGalleryQueryHandler;
use App\Application\PublicSite\GetPublicPageQuery;
use App\Application\PublicSite\GetPublicPageQueryHandler;
use App\Application\PublicSite\GetPublicResumeQuery;
use App\Application\PublicSite\GetPublicResumeQueryHandler;
use App\Application\PublicSite\GetPublicSiteChromeQuery;
use App\Application\PublicSite\GetPublicSiteChromeQueryHandler;
use App\Application\PublicSite\ListPublicContentQuery;
use App\Application\PublicSite\ListPublicContentQueryHandler;
use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Http\Controllers\Controller;
use App\Http\Responses\PublicContentDetailResponseDto;
use App\Http\Responses\PublicContentListResponseDto;
use App\Http\Responses\PublicContentResponseFactory;
use App\Http\Responses\PublicEmailChallengeResponseDto;
use App\Http\Responses\PublicHomeGalleryResponseDto;
use App\Http\Responses\PublicListMetaDto;
use App\Http\Responses\PublicPageResponseDto;
use App\Http\Responses\PublicResumeResponseFactory;
use App\Http\Responses\PublicSiteChromeResponseDto;
use App\OpenGraph\OgImageUrlGenerator;
use App\Support\PublicMediaUrl;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

/**
 * Read-only content contract for the public frontend.
 *
 * The endpoint intentionally returns public presentation data only. Laravel
 * remains responsible for querying the database and the admin continues to
 * edit the same records; the public frontend consumes this contract.
 */
class PublicSiteApiController extends Controller
{
    private const COLLECTIONS = [
        'feed',
        'cases',
        'collections',
        'credits',
        'experiments',
        'projects',
        'snippets',
        'technologies',
        'topics',
        'writing',
    ];

    /** @response array{data: list<array<string, mixed>>, meta: array<string, mixed>} */
    #[ScrambleResponse(200, type: 'array{data: list<array<string, mixed>>, meta: array<string, mixed>}')]
    #[ScrambleResponse(404, 'The requested collection was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function collection(
        Request $request,
        string $collection,
        ListPublicContentQueryHandler $handler,
        PublicContentResponseFactory $presenter,
    ): JsonResponse {
        abort_unless(in_array($collection, self::COLLECTIONS, true), 404);

        $locale = Locale::normalize($request->query('locale'));
        $perPage = min(max((int) $request->query('per_page', 50), 1), 100);
        $sort = $this->sort($request->query('sort'));
        $search = $this->queryString($request->query('q'));
        $type = $this->queryString($request->query('type'));
        $topic = $this->queryString($request->query('topic'));
        $kind = $this->queryString($request->query('kind'));
        $items = $handler->handle(new ListPublicContentQuery(
            collection: $collection,
            locale: $locale,
            perPage: $perPage,
            sort: $sort,
            featured: $request->boolean('featured'),
            page: $request->integer('page', 1),
            search: $search,
            type: $type,
            topic: $topic,
            kind: $kind,
        ));

        $data = $items->page->getCollection()
            ->map(fn ($item) => $collection === 'feed'
                ? $presenter->feedItem($item, $locale)
                : $presenter->collectionItem($collection, $item, $locale))
            ->values();

        return response()->json(PublicContentListResponseDto::fromPage(
            $data->all(),
            PublicListMetaDto::fromPage($items->page, $locale),
        )->toArray())->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    /** @response array<string, mixed> */
    #[ScrambleResponse(200, type: 'array<string, mixed>')]
    #[ScrambleResponse(404, 'The requested document was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function document(
        Request $request,
        string $collection,
        string $slug,
        GetPublicContentQueryHandler $handler,
        PublicContentResponseFactory $presenter,
    ): JsonResponse {
        abort_unless(in_array($collection, self::COLLECTIONS, true), 404);

        $locale = Locale::normalize($request->query('locale'));
        $perPage = min(max((int) $request->query('per_page', 100), 1), 100);
        $page = max(1, $request->integer('page', 1));
        $result = $handler->handle(new GetPublicContentQuery(
            collection: $collection,
            identifier: $slug,
            perPage: $perPage,
            page: $page,
            locale: $locale,
        ));

        abort_unless($result !== null, 404);

        $item = $presenter->documentItem(
            $collection,
            $result->item,
            $locale,
            $result->resources,
        );

        return response()->json(PublicContentDetailResponseDto::fromArray($item)->toArray())
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    public function resumePdf(string $locale): Response
    {
        if (! in_array($locale, ['en', 'pt-BR'], true)) {
            abort(404);
        }

        $disk = Storage::disk((string) config('filesystems.default'));
        $path = "resume/resume-{$locale}.pdf";
        if (! $disk->exists($path)) {
            abort(404);
        }

        $stream = $disk->readStream($path);
        if (! is_resource($stream)) {
            abort(503);
        }

        return response()->stream(function () use ($stream): void {
            try {
                fpassthru($stream);
            } finally {
                fclose($stream);
            }
        }, 200, [
            'Cache-Control' => 'public, max-age=3600',
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=resume-{$locale}.pdf",
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    /** @response array<string, mixed>|null */
    #[ScrambleResponse(200, type: 'array<string, mixed>|null')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function protectedEmailChallenge(
        GetPublicEmailChallengeQueryHandler $handler,
    ): JsonResponse|Response {
        $challenge = $handler->handle(new GetPublicEmailChallengeQuery);

        return response()->json(PublicEmailChallengeResponseDto::fromResult($challenge)->toArray());
    }

    /**
     * @response array{
     *   site: array{
     *     short_name: string|null,
     *     portfolio_url: string,
     *     source_repository_url: string,
     *     contact_enabled: bool,
     *     contact_email_available: bool,
     *     contact_available: bool,
     *     contact_profiles: array<int, array{platform: string, label: string, url: string}>,
     *     protected_email: null,
     *     maintenance_enabled: bool,
     *     maintenance_title: string|null,
     *     maintenance_description: string|null,
     *     feature_flags: array{
     *       content_actions: array{
     *         copy_text: bool,
     *         copy_url: bool,
     *         download_text: bool
     *       },
     *       contextual_cursor: bool,
     *       feed: array{
     *         flat_cards: bool
     *       }
     *     },
     *     seo: array{
     *       title: string|null,
     *       description: string|null,
     *       canonical: string|null,
     *       image: string|null,
     *       imageAlt: string|null,
     *       robots: string|null,
     *       noIndex: bool,
     *       keywords: array<int, string>
     *     }|null
     *   },
     *   profile: array{
     *     name: string,
     *     title: string|null,
     *     location: string|null,
     *     description: string|null,
     *     milestones: array<int, array{year: string|null, title: string|null, description: string|null, hidden: bool}>,
     *     interests: string|null,
     *     learning: string|null,
     *     personal_interests: array<int, array{value: string}>
     *   }|null,
     *   copyright: string,
     *   navigation: array{
     *     sidebar: array<int, array{key: string, label: string|null, items: array<int, array{route: string, children: array<int, array{route: string, children: null}>}>}>,
     *     footer_links: array<int, array{route: string, children: array<int, array{route: string, children: null}>}>,
     *     sitemap: array<int, array{route: string, children: array<int, array{route: string, children: null}>}>
     *   },
     *   build: array{commit_sha: string, build_time: string},
     *   visibility: array{
     *     about: bool,
     *     resume: bool,
     *     portfolio: bool,
     *     cases: bool,
     *     contact: bool,
     *     license: bool,
     *     credits: bool,
     *     follow: bool,
     *     feed: bool,
     *     writing: bool,
     *     findings: bool,
     *     topics: bool,
     *     collections: bool,
     *     snippets: bool,
     *     right_sidebar: bool
     *   }
     * }
     */
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function chrome(
        Request $request,
        PublicSiteChromeCache $cache,
        GetPublicSiteChromeQueryHandler $handler,
    ): JsonResponse {
        $startedAt = hrtime(true);
        $locale = Locale::normalize($request->query('locale'));
        $data = $cache->get($locale);
        $cacheState = 'hit';

        if ($data === null) {
            $cacheState = 'miss';
            $data = $cache->remember(
                $locale,
                function () use ($handler, $locale): array {
                    return PublicSiteChromeResponseDto::fromResult(
                        $handler->handle(new GetPublicSiteChromeQuery($locale)),
                    )->toArray();
                },
                static fn (array $value): bool => ($value['site']['maintenance_enabled'] ?? false) !== true,
            );
        }

        $maintenanceEnabled = ($data['site']['maintenance_enabled'] ?? false) === true;
        $duration = (hrtime(true) - $startedAt) / 1_000_000;

        if ($maintenanceEnabled) {
            return response()->json($data)
                ->header('Cache-Control', 'no-store, no-cache, must-revalidate')
                ->header('X-Public-Site-Cache', $cacheState)
                ->header('Server-Timing', 'public-site-chrome;dur='.$duration);
        }

        return response()->json($data)
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
            ->header('X-Public-Site-Cache', $cacheState)
            ->header('Server-Timing', 'public-site-chrome;dur='.$duration);
    }

    #[ScrambleResponse(200, type: 'array')]
    public function page(
        Request $request,
        string $slug,
        GetPublicPageQueryHandler $handler,
        OgImageUrlGenerator $ogImages,
        PublicMediaUrl $media,
    ): JsonResponse {
        $result = $handler->handle(new GetPublicPageQuery(
            slug: $slug,
            locale: Locale::normalize($request->query('locale')),
        ));
        abort_unless($result !== null, 404);

        return response()->json(PublicPageResponseDto::fromResult($result, $ogImages, $media)->toArray())
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    #[ScrambleResponse(200, type: 'array{highlights: list<array{kind: string, item: array<string, mixed>}>, feed: list<array<string, mixed>>, portfolio: array{cases: list<array<string, mixed>>, projects: list<array<string, mixed>>, experiments: list<array<string, mixed>>, collections: list<array<string, mixed>>, snippets: list<array<string, mixed>>, technologies: list<array<string, mixed>>, topics: list<array<string, mixed>>, credits: list<array<string, mixed>>}, collection_showcases: list<array{collection: array<string, mixed>, items: list<array<string, mixed>>}>, totals: array{highlights: int, feed: int, portfolio: array{cases: int, projects: int, experiments: int, collections: int, snippets: int, technologies: int, topics: int, credits: int}, collection_showcases: int}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function homeGallery(
        Request $request,
        GetPublicHomeGalleryQueryHandler $handler,
        PublicContentResponseFactory $presenter,
    ): JsonResponse {
        $locale = Locale::normalize($request->query('locale'));
        $result = $handler->handle(new GetPublicHomeGalleryQuery($locale));

        return response()->json(
            PublicHomeGalleryResponseDto::fromResult($result, $presenter, $locale)->toArray(),
        )->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    /**
     * @response array{
     *   summary: string|null,
     *   leadership: string|list<string>,
     *   education: string|list<string>,
     *   certificates: string|list<string>,
     *   certifications: string|list<string>,
     *   publications: string|list<string>,
     *   recommendations: string|list<string>,
     *   technical_productions: string|list<string>,
     *   events: string|list<string>,
     *   awards: string|list<string>,
     *   experience: list<string>,
     *   selected_cases: list<array<string, mixed>>|list<string>,
     *   skills: list<array<string, mixed>>|list<string>,
     *   languages: list<array{name: string|null, proficiency: string|''}>|list<string>
     * }
     */
    #[ScrambleResponse(200, type: "array{summary: string|null, leadership: string|array<int, string>, education: string|array<int, string>, certificates: string|array<int, string>, certifications: string|array<int, string>, publications: string|array<int, string>, recommendations: string|array<int, string>, technical_productions: string|array<int, string>, events: string|array<int, string>, awards: string|array<int, string>, experience: array<int, string>, selected_cases: array<int, array{slug: string, url: string, title: string, status: string|null, summary: string|null, published_at: string|null, external: string, meta: string|null, context: string|null, role: string|null, result: string|null, metrics: string|null, body: string|null, technologies: array<int, array{slug: string, name: string}>, show_history: bool, history: null, href: string, related: null, updated_at: string|null}>|array<int, string>, skills: array<int, array{name: string, technologies: array<int, array{slug: string, name: string, code: null, url: null, skills: null, resume_skills: null}>}>|array<int, string>, languages: array<int, array{name: string, proficiency: string|''}>|array<int, string>}")]
    public function resumeData(
        Request $request,
        GetPublicResumeQueryHandler $handler,
        PublicResumeResponseFactory $presenter,
        PublicMediaUrl $media,
    ): JsonResponse {
        $locale = Locale::normalize($request->query('locale'));

        return response()->json($presenter->fromResult(
            $handler->handle(new GetPublicResumeQuery($locale)),
            $media,
        )->toArray())
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    private function sort(mixed $value): ?string
    {
        return in_array($value, ['asc', 'desc', 'alpha', 'popular'], true) ? $value : null;
    }

    private function queryString(mixed $value): ?string
    {
        return is_string($value) && trim($value) !== '' ? trim($value) : null;
    }
}
