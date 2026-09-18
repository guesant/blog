<?php

namespace App\Http\Controllers\Api;

use App\Content\Locale;
use App\Content\ResourceApiTransformer;
use App\Content\ResourceQuery;
use App\Content\SiteSettingsQuery;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FindingApiController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return response()->json(['error' => 'maintenance'], 503)->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $filters = $request->only(['q', 'type', 'topic', 'rating', 'consumption_state', 'year', 'free_only']);

        $resources = (new ResourceQuery)->list($filters, $locale);

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $page = max((int) $request->query('page', 1), 1);
        $total = $resources->count();

        $transformer = new ResourceApiTransformer;
        $data = $resources->forPage($page, $perPage)->values()->map(
            fn ($resource) => $transformer->toArray($resource, $locale)
        )->all();

        return response()->json([
            'data' => $data,
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'locale' => $locale,
            ],
        ]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return response()->json(['error' => 'maintenance'], 503)->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $result = (new ResourceQuery)->findBySlug($slug, $locale);

        if (! $result) {
            return response()->json(['error' => 'not_found'], 404);
        }

        $transformer = new ResourceApiTransformer;

        return response()->json($transformer->toArray($result['resource'], $locale));
    }
}
