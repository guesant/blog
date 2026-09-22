<?php

namespace App\Http\Controllers\Api;

use App\Content\Locale;
use App\Content\PublicResourceQuery;
use App\Content\ResourceApiTransformer;
use App\Content\SiteSettingsQuery;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FindingApiController extends Controller
{
    /** @response array{data: list<array<string, mixed>>, meta: array<string, mixed>} */
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function index(Request $request): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $filters = $request->only(['q', 'type', 'topic', 'rating', 'consumption_state', 'year', 'free_only']);

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $sort = in_array($request->query('sort'), ['asc', 'desc', 'alpha', 'popular'], true)
            ? $request->query('sort')
            : null;
        $resources = (new PublicResourceQuery)->paginate($filters, $locale, $perPage, $sort);

        $transformer = app(ResourceApiTransformer::class);
        $data = $resources->getCollection()->map(
            fn ($resource) => $transformer->toArray($resource, $locale, null, true)
        )->all();

        return response()->json([
            'data' => $data,
            'meta' => [
                'page' => $resources->currentPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
                'last_page' => $resources->lastPage(),
                'locale' => $locale,
                'facets' => (new PublicResourceQuery)->facetOptions($locale),
            ],
        ]);
    }

    /** @response array<string, mixed> */
    #[ScrambleResponse(404, 'The requested finding was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function show(Request $request, string $slug): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $resource = (new PublicResourceQuery)->findBySlug($slug, $locale);

        if (! $resource) {
            return ApiErrorResponse::make(
                ApiErrorCode::NotFound,
                404,
                'The requested resource was not found.',
            );
        }

        $transformer = app(ResourceApiTransformer::class);

        return response()->json($transformer->toArray($resource, $locale, [], true));
    }
}
