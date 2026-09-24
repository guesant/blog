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
use App\Application\PublicSite\IsPublicSiteInMaintenanceQuery;
use App\Application\PublicSite\IsPublicSiteInMaintenanceQueryHandler;
use App\Application\PublicSite\ListPublicContentQuery;
use App\Application\PublicSite\ListPublicContentQueryHandler;
use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\Http\Responses\PublicContentDetailResponseDto;
use App\Http\Responses\PublicContentListResponseDto;
use App\Http\Responses\PublicContentResponseFactory;
use App\Http\Responses\PublicEmailChallengeResponseDto;
use App\Http\Responses\PublicHomeGalleryResponseDto;
use App\Http\Responses\PublicListMetaDto;
use App\Http\Responses\PublicPageResponseDto;
use App\Http\Responses\PublicResumeResponseFactory;
use App\Http\Responses\PublicSiteChromeResponseDto;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        IsPublicSiteInMaintenanceQueryHandler $maintenance,
        PublicContentResponseFactory $presenter,
    ): JsonResponse {
        if ($maintenance->handle(new IsPublicSiteInMaintenanceQuery)) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        abort_unless(in_array($collection, self::COLLECTIONS, true), 404);

        $locale = Locale::normalize($request->query('locale'));
        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
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
        $groups = $collection === 'credits' ? $presenter->creditGroups($data->all()) : null;

        return response()->json(PublicContentListResponseDto::fromPage(
            $data->all(),
            PublicListMetaDto::fromPage($items->page, $locale),
            $groups,
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
        IsPublicSiteInMaintenanceQueryHandler $maintenance,
        PublicContentResponseFactory $presenter,
    ): JsonResponse {
        if ($maintenance->handle(new IsPublicSiteInMaintenanceQuery)) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

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

        $path = storage_path("app/public/resume-{$locale}.pdf");
        if (! is_file($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Cache-Control' => 'public, max-age=3600',
            'Content-Type' => 'application/pdf',
        ]);
    }

    /** @response array<string, mixed>|null */
    #[ScrambleResponse(200, type: 'array<string, mixed>|null')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function protectedEmailChallenge(
        GetPublicEmailChallengeQueryHandler $handler,
        IsPublicSiteInMaintenanceQueryHandler $maintenance,
    ): JsonResponse|Response {
        if ($maintenance->handle(new IsPublicSiteInMaintenanceQuery)) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        $challenge = $handler->handle(new GetPublicEmailChallengeQuery);

        return response()->json(PublicEmailChallengeResponseDto::fromResult($challenge)->toArray());
    }

    /**
     * @response array{
     *   site: array{
     *     short_name: string|null,
     *     portfolio_url: string,
     *     source_repository_url: string,
     *     contact_available: bool,
     *     contact_profiles: array<int, array{platform: string, label: string, url: string}>,
     *     protected_email: null,
     *     maintenance_enabled: bool,
     *     maintenance_eyebrow: string|null,
     *     maintenance_title: string|null,
     *     maintenance_description: string|null,
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
     *     birth_date: string,
     *     birth_city: string|null,
     *     interests: string|null,
     *     learning: string|null,
     *     personal_interests: array<int, array{value: string}>
     *   }|null,
     *   copyright: string,
     *   navigation: array{
     *     sidebar: array<int, array<int, array{route: string, children: array<int, array{route: string, children: null}>}>>,
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

        if (($data['site']['maintenance_enabled'] ?? false) === true) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600)
                ->header('X-Public-Site-Cache', $cacheState)
                ->header('Server-Timing', 'public-site-chrome;dur='.((hrtime(true) - $startedAt) / 1_000_000));
        }

        return response()->json($data)
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
            ->header('X-Public-Site-Cache', $cacheState)
            ->header('Server-Timing', 'public-site-chrome;dur='.((hrtime(true) - $startedAt) / 1_000_000));
    }

    #[ScrambleResponse(200, type: 'array')]
    public function page(Request $request, string $slug, GetPublicPageQueryHandler $handler): JsonResponse
    {
        $result = $handler->handle(new GetPublicPageQuery(
            slug: $slug,
            locale: Locale::normalize($request->query('locale')),
        ));
        abort_unless($result !== null, 404);

        return response()->json(PublicPageResponseDto::fromResult($result)->toArray())
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    #[ScrambleResponse(200, type: 'array{highlights: list<array{kind: string, item: array<string, mixed>}>, recent: array{writing: list<array<string, mixed>>, finding: list<array<string, mixed>>, collection: list<array<string, mixed>>}, popular: array{writing: list<array<string, mixed>>, finding: list<array<string, mixed>>, collection: list<array<string, mixed>>}, portfolio: array{cases: list<array<string, mixed>>, projects: list<array<string, mixed>>, experiments: list<array<string, mixed>>, collections: list<array<string, mixed>>, snippets: list<array<string, mixed>>, technologies: list<array<string, mixed>>, topics: list<array<string, mixed>>, credits: list<array<string, mixed>>}, collection_showcases: list<array{collection: array<string, mixed>, items: list<array<string, mixed>>}>}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function homeGallery(
        Request $request,
        GetPublicHomeGalleryQueryHandler $handler,
        IsPublicSiteInMaintenanceQueryHandler $maintenance,
        PublicContentResponseFactory $presenter,
    ): JsonResponse {
        if ($maintenance->handle(new IsPublicSiteInMaintenanceQuery)) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

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
    ): JsonResponse {
        $locale = Locale::normalize($request->query('locale'));

        return response()->json($presenter->fromResult(
            $handler->handle(new GetPublicResumeQuery($locale)),
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
