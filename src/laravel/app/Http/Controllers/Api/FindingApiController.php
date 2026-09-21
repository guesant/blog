<?php

namespace App\Http\Controllers\Api;

use App\Content\Locale;
use App\Content\ResourceApiTransformer;
use App\Content\ResourceQuery;
use App\Content\SiteSettingsQuery;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FindingApiController extends Controller
{
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
        $resources = (new ResourceQuery)->paginate($filters, $locale, $perPage, $sort);

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
                'facets' => (new ResourceQuery)->facetOptions($locale),
            ],
        ]);
    }

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
        $result = (new ResourceQuery)->findBySlug($slug, $locale);

        if (! $result) {
            return ApiErrorResponse::make(
                ApiErrorCode::NotFound,
                404,
                'The requested resource was not found.',
            );
        }

        $transformer = app(ResourceApiTransformer::class);

        return response()->json($transformer->toArray($result['resource'], $locale, $result['relations'], true));
    }
}
