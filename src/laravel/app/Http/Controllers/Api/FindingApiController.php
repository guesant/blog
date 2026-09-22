<?php

namespace App\Http\Controllers\Api;

use App\Application\PublicSite\GetPublicFinding;
use App\Application\PublicSite\GetPublicFindingHandler;
use App\Application\PublicSite\IsPublicSiteInMaintenance;
use App\Application\PublicSite\IsPublicSiteInMaintenanceHandler;
use App\Application\PublicSite\ListPublicFindings;
use App\Application\PublicSite\ListPublicFindingsHandler;
use App\Content\Locale;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\Http\Responses\PublicFindingResponseFactory;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FindingApiController extends Controller
{
    /** @response array{data: list<array<string, mixed>>, meta: array<string, mixed>} */
    #[ScrambleResponse(200, type: 'array{data: list<array<string, mixed>>, meta: array<string, mixed>}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function index(
        Request $request,
        ListPublicFindingsHandler $handler,
        IsPublicSiteInMaintenanceHandler $maintenance,
        PublicFindingResponseFactory $presenter,
    ): JsonResponse {
        if ($maintenance->handle(new IsPublicSiteInMaintenance)) {
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
        $result = $handler->handle(new ListPublicFindings(
            filters: $filters,
            locale: $locale,
            perPage: $perPage,
            sort: $sort,
        ));

        return response()->json($presenter->list(
            $result->page,
            $locale,
            $result->facets,
        )->toArray())->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    /** @response array<string, mixed> */
    #[ScrambleResponse(200, type: 'array<string, mixed>')]
    #[ScrambleResponse(404, 'The requested finding was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function show(
        Request $request,
        string $slug,
        GetPublicFindingHandler $handler,
        IsPublicSiteInMaintenanceHandler $maintenance,
        PublicFindingResponseFactory $presenter,
    ): JsonResponse {
        if ($maintenance->handle(new IsPublicSiteInMaintenance)) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $resource = $handler->handle(new GetPublicFinding($slug, $locale));

        if (! $resource) {
            return ApiErrorResponse::make(
                ApiErrorCode::NotFound,
                404,
                'The requested resource was not found.',
            );
        }

        return response()->json($presenter->detail($resource, $locale)->toArray())
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }
}
