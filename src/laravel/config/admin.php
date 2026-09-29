<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Admin panel path
    |--------------------------------------------------------------------------
    |
    | URL path prefix for the Filament admin panel. Set ADMIN_PATH in .env to
    | move the panel off the well-known /admin location. This is obscurity,
    | not security — authentication is still what protects the panel — but it
    | cuts the background noise of bots probing /admin.
    |
    */

    'path' => env('ADMIN_PATH', 'admin'),

    'oidc_group' => env('PORTFOLIO_ADMIN_OIDC_GROUP', 'admins'),

];
