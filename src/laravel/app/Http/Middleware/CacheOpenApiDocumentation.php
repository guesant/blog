<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Cache\Repository;
use Illuminate\Http\Request;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Symfony\Component\HttpFoundation\Response;

class CacheOpenApiDocumentation
{
    private const FINGERPRINT_CACHE_KEY = 'scramble.documentation.fingerprint';

    private static array $responses = [];

    private static ?array $fingerprintRecord = null;

    public function handle(Request $request, Closure $next): Response
    {
        $store = cache()->store((string) config('scramble.cache.store', 'file'));
        $key = $this->cacheKey($request);
        $fingerprint = $this->fingerprint($store);
        $cached = self::$responses[$key] ?? $store->get($key);

        if ($this->matches($cached, $fingerprint)) {
            self::$responses[$key] = $cached;

            return response($cached['body'], $cached['status'], $cached['headers']);
        }

        $response = $next($request);

        $body = $response->getContent();

        if ($response->isSuccessful() && is_string($body)) {
            $cached = [
                'fingerprint' => $fingerprint,
                'body' => $body,
                'status' => $response->getStatusCode(),
                'headers' => [
                    'Content-Type' => $response->headers->get('Content-Type', 'text/html; charset=UTF-8'),
                ],
            ];

            self::$responses[$key] = $cached;
            $store->forever($key, $cached);
        }

        return $response;
    }

    private function matches(mixed $cached, string $fingerprint): bool
    {
        return is_array($cached)
          && ($cached['fingerprint'] ?? null) === $fingerprint
          && is_string($cached['body'] ?? null)
          && is_int($cached['status'] ?? null)
          && is_array($cached['headers'] ?? null);
    }

    private function cacheKey(Request $request): string
    {
        $requestIdentity = implode('|', [
            $request->getSchemeAndHttpHost(),
            $request->getPathInfo(),
        ]);

        return 'scramble.documentation.response:'.hash('sha256', $requestIdentity);
    }

    private function fingerprint(Repository $store): string
    {
        $manifest = $this->sourceManifest();

        if (self::$fingerprintRecord && self::$fingerprintRecord['manifest'] === $manifest) {
            return self::$fingerprintRecord['fingerprint'];
        }

        $cached = $store->get(self::FINGERPRINT_CACHE_KEY);

        if (is_array($cached)
            && ($cached['manifest'] ?? null) === $manifest
            && is_string($cached['fingerprint'] ?? null)) {
            self::$fingerprintRecord = $cached;

            return $cached['fingerprint'];
        }

        $hash = hash_init('sha256');
        hash_update($hash, serialize($manifest));

        foreach (array_keys($manifest['files']) as $file) {
            hash_update_file($hash, $file);
        }

        $fingerprint = hash_final($hash);
        $record = [
            'manifest' => $manifest,
            'fingerprint' => $fingerprint,
        ];

        self::$fingerprintRecord = $record;
        $store->forever(self::FINGERPRINT_CACHE_KEY, $record);

        return $fingerprint;
    }

    private function sourceManifest(): array
    {
        $files = array_filter([
            base_path('composer.lock'),
            base_path('config/scramble.php'),
        ], 'is_file');

        foreach ([base_path('app'), base_path('routes'), base_path('resources/views')] as $directory) {
            if (! is_dir($directory)) {
                continue;
            }

            $iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS),
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $files[] = $file->getPathname();
                }
            }
        }

        sort($files);
        $manifest = [
            'config' => serialize(config('scramble')),
            'files' => [],
        ];

        foreach ($files as $file) {
            $stat = stat($file);

            if (is_array($stat)) {
                $manifest['files'][$file] = [
                    $stat['ctime'],
                    $stat['mtime'],
                    $stat['size'],
                ];
            }
        }

        return $manifest;
    }
}
