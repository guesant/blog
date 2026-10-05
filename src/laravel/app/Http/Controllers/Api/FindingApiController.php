<?php

namespace App\Http\Controllers\Api;

use App\Application\PublicSite\GetPublicFindingQuery;
use App\Application\PublicSite\GetPublicFindingQueryHandler;
use App\Application\PublicSite\IsPublicSiteInMaintenanceQuery;
use App\Application\PublicSite\IsPublicSiteInMaintenanceQueryHandler;
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
    /** @response array<string, mixed> */
    #[ScrambleResponse(200, type: 'array<string, mixed>')]
    #[ScrambleResponse(404, 'The requested finding was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function show(
        Request $request,
        string $slug,
        GetPublicFindingQueryHandler $handler,
        IsPublicSiteInMaintenanceQueryHandler $maintenance,
        PublicFindingResponseFactory $presenter,
    ): JsonResponse {
        if ($maintenance->handle(new IsPublicSiteInMaintenanceQuery)) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $resource = $handler->handle(new GetPublicFindingQuery($slug, $locale));

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
