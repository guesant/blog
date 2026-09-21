<?php

return [
    'api_path' => 'api/v1',
    'api_domain' => null,
    'export_path' => 'openapi/public-site.json',
    'cache' => [
        'key' => 'scramble.openapi.public-site',
        'store' => 'file',
    ],
    'info' => [
        'version' => env('API_VERSION', '1.0.0'),
        'description' => 'Public JSON API for guesant.net.',
    ],
    'ui' => [
        'title' => 'Guesant public API',
    ],
    'dev_tools' => [
        'enabled' => false,
    ],
    'renderer' => 'scalar',
    'renderers' => [
        'scalar' => [
            'view' => 'scramble::scalar',
            'cdn' => 'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
            'theme' => 'default',
            'proxyUrl' => null,
            'darkMode' => false,
            'showDeveloperTools' => 'never',
            'agent' => ['disabled' => true],
            'credentials' => 'include',
        ],
    ],
    'servers' => [
        'Production' => 'https://api.guesant.net/api/v1',
        'Local' => 'http://localhost:8001/api/v1',
    ],
    'middleware' => [
        'web',
    ],
    'extensions' => [],
    'security_strategy' => null,
];
