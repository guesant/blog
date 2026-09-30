<?php

use App\Http\Controllers\Api\PublicSiteApiController;
use App\Http\Controllers\AdminMediaDownloadController;
use App\Http\Controllers\KeycloakAuthController;
use App\Http\Controllers\OgImageController;
use App\Http\Controllers\PublicMetadataController;
use App\Http\Controllers\SnippetDownloadController;
use App\Http\Middleware\CheckMaintenanceMode;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Route;
use Illuminate\View\Middleware\ShareErrorsFromSession;

Route::view('/docs/swagger', 'docs.swagger')->name('docs.swagger')->middleware('throttle:public-docs');
Route::view('/docs/swagger/index.html', 'docs.swagger')->name('docs.swagger.index')->middleware('throttle:public-docs');

Route::get('/auth/keycloak/redirect', [KeycloakAuthController::class, 'redirect'])->name('auth.keycloak.redirect');
Route::get('/auth/keycloak/callback', [KeycloakAuthController::class, 'callback'])->name('auth.keycloak.callback');
Route::post('/auth/keycloak/logout', [KeycloakAuthController::class, 'logout'])->name('auth.keycloak.logout');

Route::get('/'.trim((string) config('admin.path'), '/').'/media/{mediaAsset}/download', AdminMediaDownloadController::class)
    ->middleware(['auth:web', 'can:access-private-api'])
    ->name('admin.media.download');

Route::get('/og/{payload}/{signature}.png', OgImageController::class)
    ->where('payload', '[A-Za-z0-9_-]+')
    ->where('signature', '[A-Za-z0-9_-]+')
    ->middleware('throttle:og-images')
    ->withoutMiddleware([
        CheckMaintenanceMode::class,
        AddQueuedCookiesToResponse::class,
        EncryptCookies::class,
        ShareErrorsFromSession::class,
        StartSession::class,
        PreventRequestForgery::class,
        ValidateCsrfToken::class,
    ]);

Route::get('/robots.txt', [PublicMetadataController::class, 'robots'])->middleware('throttle:public-metadata');
Route::get('/sitemap.xml', [PublicMetadataController::class, 'sitemap'])->middleware('throttle:public-metadata');
Route::get('/.well-known/webfinger', [PublicMetadataController::class, 'webfinger'])->middleware('throttle:public-metadata');
Route::get('/feed.xml', fn (PublicMetadataController $controller) => $controller->feed('en', 'rss'))->middleware('throttle:public-feed');
Route::get('/pt-BR/feed.xml', fn (PublicMetadataController $controller) => $controller->feed('pt-BR', 'rss'))->middleware('throttle:public-feed');
Route::get('/atom.xml', fn (PublicMetadataController $controller) => $controller->feed('en', 'atom'))->middleware('throttle:public-feed');
Route::get('/pt-BR/atom.xml', fn (PublicMetadataController $controller) => $controller->feed('pt-BR', 'atom'))->middleware('throttle:public-feed');
Route::get('/feed.json', fn (PublicMetadataController $controller) => $controller->feed('en', 'json'))->middleware('throttle:public-feed');
Route::get('/pt-BR/feed.json', fn (PublicMetadataController $controller) => $controller->feed('pt-BR', 'json'))->middleware('throttle:public-feed');
Route::get('/resume-{locale}.pdf', [PublicSiteApiController::class, 'resumePdf'])->middleware('throttle:public-pdf');
Route::get('/snippets/{slug}/download', SnippetDownloadController::class)->middleware('throttle:snippet-zip');
Route::get('/pt-BR/snippets/{slug}/download', SnippetDownloadController::class)->middleware('throttle:snippet-zip');
