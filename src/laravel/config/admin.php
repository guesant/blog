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

    /*
    |--------------------------------------------------------------------------
    | Admin panel allowed emails
    |--------------------------------------------------------------------------
    |
    | Comma-separated list of emails (ADMIN_ALLOWED_EMAILS in .env) that are
    | actually authorized to access the Filament panel. Unlike `path` above,
    | this is real access control: any authenticated user whose email is not
    | in this list is denied entry, regardless of whether they know the path.
    | Empty by default, which means nobody can access the panel until this is
    | set.
    |
    */

    'allowed_emails' => array_filter(array_map('trim', explode(',', (string) env('ADMIN_ALLOWED_EMAILS', '')))),

    'oidc_group' => env('PORTFOLIO_ADMIN_OIDC_GROUP', 'admins'),

];
