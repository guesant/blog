<?php

return [
    'back_home' => 'back to home',
    'error_prefix' => 'error',
    '403' => [
        'title' => 'access denied',
        'description' => "you don't have permission to view this page.",
    ],
    '404' => [
        'title' => 'page not found',
        'description' => "the page you're looking for doesn't exist or may have moved.",
    ],
    '419' => [
        'title' => 'page expired',
        'description' => 'your session expired. go back and try again.',
    ],
    '429' => [
        'title' => 'too many requests',
        'description' => 'slow down a little and try again in a moment.',
    ],
    '500' => [
        'title' => 'something went wrong',
        'description' => "an unexpected error occurred. it's been logged and will be looked into.",
    ],
    '503' => [
        'title' => 'under maintenance',
        'description' => 'the site is briefly unavailable for maintenance. check back shortly.',
    ],
    'generic' => [
        'title' => 'unexpected error',
        'description' => 'something went wrong while handling your request.',
    ],
];
