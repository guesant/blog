<?php

use App\Http\Controllers\Api\FindingApiController;
use App\Http\Controllers\Api\PublicSiteApiController;
use App\Http\Controllers\SnippetDownloadController;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['auth:web', 'can:access-private-api'])
    ->group(function (): void {
        Route::middleware('throttle:public-api')
            ->withoutMiddleware(['auth:web', 'can:access-private-api'])
            ->group(function (): void {
                Route::get('/site/chrome', [PublicSiteApiController::class, 'chrome']);
                Route::get('/site/home-gallery', [PublicSiteApiController::class, 'homeGallery']);
                Route::get('/site/pages/{slug}', [PublicSiteApiController::class, 'page']);
                Route::get('/site/resume', [PublicSiteApiController::class, 'resumeData']);
                Route::get('/content/{collection}', [PublicSiteApiController::class, 'collection']);
                Route::get('/content/{collection}/{slug}', [PublicSiteApiController::class, 'document']);
                Route::get('/resume/{locale}.pdf', [PublicSiteApiController::class, 'resumePdf']);
                Route::post('/protected-email/challenge', [PublicSiteApiController::class, 'protectedEmailChallenge']);
                Route::get('/findings', [FindingApiController::class, 'index']);
                Route::get('/findings/{slug}', [FindingApiController::class, 'show']);
                Route::get('/snippets/{slug}/download', SnippetDownloadController::class)
                    ->middleware('throttle:snippet-zip');
            });
    });

Route::fallback(fn () => ApiErrorResponse::make(
    ApiErrorCode::NotFound,
    404,
    'The requested resource was not found.',
))->middleware('throttle:public-api');
