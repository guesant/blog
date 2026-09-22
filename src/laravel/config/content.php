<?php

return [
    'open_graph' => [
        'enabled' => filter_var(env('CONTENT_OPEN_GRAPH_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
        'cache_ttl' => (int) env('CONTENT_OPEN_GRAPH_CACHE_TTL', 604800),
        'cache_max_entries' => (int) env('CONTENT_OPEN_GRAPH_CACHE_MAX_ENTRIES', 256),
        'fetch_timeout' => (int) env('CONTENT_OPEN_GRAPH_FETCH_TIMEOUT', 3),
        'connect_timeout' => (int) env('CONTENT_OPEN_GRAPH_CONNECT_TIMEOUT', 2),
        'max_bytes' => (int) env('CONTENT_OPEN_GRAPH_MAX_BYTES', 262144),
        'queue_connection' => env('CONTENT_OPEN_GRAPH_QUEUE_CONNECTION', 'database'),
        'queue' => env('CONTENT_OPEN_GRAPH_QUEUE', 'open-graph'),
    ],
];
