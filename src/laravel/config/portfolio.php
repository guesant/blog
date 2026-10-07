<?php

return [
    'public_media_url' => env('PORTFOLIO_PUBLIC_MEDIA_URL', 'http://localhost:8001/api/v1/media'),
    'media_url_signing_key' => env('PORTFOLIO_MEDIA_URL_SIGNING_KEY') ?: env('APP_KEY'),
    'media_url_previous_signing_key' => env('PORTFOLIO_MEDIA_URL_PREVIOUS_SIGNING_KEY'),
    'media_url_ttl_seconds' => (int) env('PORTFOLIO_MEDIA_URL_TTL_SECONDS', 86400),
    'public_feed_cache_ttl_seconds' => (int) env('PORTFOLIO_PUBLIC_FEED_CACHE_TTL_SECONDS', 60),
    'public_metadata_feed_cache_ttl_seconds' => (int) env('PORTFOLIO_PUBLIC_METADATA_FEED_CACHE_TTL_SECONDS', 300),
];
