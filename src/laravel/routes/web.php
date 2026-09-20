<?php

use App\Http\Controllers\Api\PublicSiteApiController;
use App\Http\Controllers\KeycloakAuthController;
use App\Http\Controllers\PublicMetadataController;
use App\Http\Controllers\SnippetDownloadController;
use Illuminate\Support\Facades\Route;

Route::get('/auth/keycloak/redirect', [KeycloakAuthController::class, 'redirect'])->name('auth.keycloak.redirect');
Route::get('/auth/keycloak/callback', [KeycloakAuthController::class, 'callback'])->name('auth.keycloak.callback');
Route::post('/auth/keycloak/logout', [KeycloakAuthController::class, 'logout'])->name('auth.keycloak.logout');

Route::get('/robots.txt', [PublicMetadataController::class, 'robots']);
Route::get('/sitemap.xml', [PublicMetadataController::class, 'sitemap']);
Route::get('/.well-known/webfinger', [PublicMetadataController::class, 'webfinger']);
Route::get('/feed.xml', fn (PublicMetadataController $controller) => $controller->feed(request(), 'en', 'rss'));
Route::get('/pt-BR/feed.xml', fn (PublicMetadataController $controller) => $controller->feed(request(), 'pt-BR', 'rss'));
Route::get('/atom.xml', fn (PublicMetadataController $controller) => $controller->feed(request(), 'en', 'atom'));
Route::get('/pt-BR/atom.xml', fn (PublicMetadataController $controller) => $controller->feed(request(), 'pt-BR', 'atom'));
Route::get('/feed.json', fn (PublicMetadataController $controller) => $controller->feed(request(), 'en', 'json'));
Route::get('/pt-BR/feed.json', fn (PublicMetadataController $controller) => $controller->feed(request(), 'pt-BR', 'json'));
Route::get('/resume-{locale}.pdf', [PublicSiteApiController::class, 'resumePdf']);
Route::get('/snippets/{slug}/download', SnippetDownloadController::class)->middleware('throttle:snippet-zip');
Route::get('/pt-BR/snippets/{slug}/download', SnippetDownloadController::class)->middleware('throttle:snippet-zip');
