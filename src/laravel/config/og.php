<?php

return [
    'enabled' => (bool) env('OG_IMAGE_ENABLED', false),
    'secret' => env('OG_IMAGE_SECRET'),
    'base_url' => env('OG_IMAGE_BASE_URL'),
    'cache_path' => env('OG_IMAGE_CACHE_PATH', storage_path('app/cache/og')),
    'cache_ttl' => (int) env('OG_IMAGE_CACHE_TTL', 31536000),
    'cache_max_bytes' => (int) env('OG_IMAGE_CACHE_MAX_BYTES', 268435456),
    'cache_max_entries' => (int) env('OG_IMAGE_CACHE_MAX_ENTRIES', 1024),
    'max_payload_bytes' => (int) env('OG_IMAGE_MAX_PAYLOAD_BYTES', 16384),
    'max_signature_bytes' => (int) env('OG_IMAGE_MAX_SIGNATURE_BYTES', 64),
    'max_title_length' => (int) env('OG_IMAGE_MAX_TITLE_LENGTH', 180),
    'max_description_length' => (int) env('OG_IMAGE_MAX_DESCRIPTION_LENGTH', 300),
    'max_image_length' => (int) env('OG_IMAGE_MAX_IMAGE_LENGTH', 2048),
    'max_concurrent_renders' => (int) env('OG_IMAGE_MAX_CONCURRENT_RENDERS', 2),
    'max_queued_renders' => (int) env('OG_IMAGE_MAX_QUEUED_RENDERS', 8),
    'queue_wait_seconds' => (float) env('OG_IMAGE_QUEUE_WAIT_SECONDS', 2),
    'render_lock_seconds' => (int) env('OG_IMAGE_RENDER_LOCK_SECONDS', 10),
    'render_timeout_seconds' => (float) env('OG_IMAGE_RENDER_TIMEOUT_SECONDS', 5),
    'rate_limit_per_minute' => (int) env('OG_IMAGE_RATE_LIMIT_PER_MINUTE', 60),
    'width' => 1200,
    'height' => 630,
    'font_regular' => env(
        'OG_IMAGE_FONT_REGULAR',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    ),
    'font_bold' => env(
        'OG_IMAGE_FONT_BOLD',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf',
    ),
];
