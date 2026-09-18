<?php

use App\Http\Controllers\Api\FindingApiController;
use App\Http\Controllers\Api\PublicSiteApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:public-api')->group(function () {
    Route::get('/public-site', [PublicSiteApiController::class, 'index']);
    Route::get('/public/knowledge-map', [PublicSiteApiController::class, 'knowledgeMap']);
    Route::post('/protected-email/challenge', [PublicSiteApiController::class, 'protectedEmailChallenge']);
    Route::get('/findings', [FindingApiController::class, 'index']);
    Route::get('/findings/{slug}', [FindingApiController::class, 'show']);
});
