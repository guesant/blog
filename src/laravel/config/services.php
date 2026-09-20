<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'site_verification' => env('GOOGLE_SITE_VERIFICATION'),
        'tag_manager_id' => env('GOOGLE_TAG_MANAGER_ID'),
        'analytics_id' => env('GOOGLE_ANALYTICS_ID'),
    ],

    'webfinger' => [
        'acct' => env('WEBFINGER_ACCT'),
    ],

    'keycloak' => [
        'client_id' => env('PORTFOLIO_ADMIN_OIDC_CLIENT_ID'),
        'client_secret' => env('PORTFOLIO_ADMIN_OIDC_CLIENT_SECRET'),
        'redirect' => env('PORTFOLIO_ADMIN_OIDC_REDIRECT_URI'),
        'base_url' => env('PORTFOLIO_ADMIN_OIDC_AUTHORITY'),
        'realms' => env('PORTFOLIO_ADMIN_OIDC_REALM', 'homelab'),
    ],

];
