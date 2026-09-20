<?php

$testEnvironment = [
    'APP_ENV' => 'testing',
    'APP_DEBUG' => 'false',
    'APP_CONFIG_CACHE' => '/tmp/portfolio-phpunit-config.php',
    'DB_CONNECTION' => 'pgsql',
    'DB_HOST' => 'postgres',
    'DB_PORT' => '5432',
    'DB_DATABASE' => 'portfolio_test',
    'DB_USERNAME' => 'portfolio',
    'DB_PASSWORD' => 'portfolio',
    'DB_URL' => '',
];

foreach ($testEnvironment as $name => $value) {
    putenv("{$name}={$value}");
    $_ENV[$name] = $value;
    $_SERVER[$name] = $value;
}

require dirname(__DIR__).'/vendor/autoload.php';
