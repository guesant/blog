<?php

use App\Http\Controllers\KeycloakAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/auth/keycloak/redirect', [KeycloakAuthController::class, 'redirect'])->name('auth.keycloak.redirect');
Route::get('/auth/keycloak/callback', [KeycloakAuthController::class, 'callback'])->name('auth.keycloak.callback');
Route::post('/auth/keycloak/logout', [KeycloakAuthController::class, 'logout'])->name('auth.keycloak.logout');
