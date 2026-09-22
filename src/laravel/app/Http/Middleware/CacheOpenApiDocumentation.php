<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Symfony\Component\HttpFoundation\Response;

class CacheOpenApiDocumentation
{
    public function handle(Request $request, Closure $next): Response
    {
        $store = cache()->store((string) config('scramble.cache.store', 'file'));
        $key = $this->cacheKey($request);
        $fingerprint = $this->fingerprint();
        $cached = $store->get($key);

        if ($this->matches($cached, $fingerprint)) {
            return response($cached['body'], $cached['status'], $cached['headers']);
        }

        $response = $next($request);

        if ($response->isSuccessful()) {
            $store->forever($key, [
                'fingerprint' => $fingerprint,
                'body' => $response->getContent(),
                'status' => $response->getStatusCode(),
                'headers' => [
                    'Content-Type' => $response->headers->get('Content-Type', 'text/html; charset=UTF-8'),
                ],
            ]);
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

    private function fingerprint(): string
    {
        $files = [
            base_path('composer.lock'),
            base_path('config/scramble.php'),
        ];

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
        $hash = hash_init('sha256');
        hash_update($hash, serialize(config('scramble')));

        foreach ($files as $file) {
            hash_update($hash, $file);
            hash_update_file($hash, $file);
        }

        return hash_final($hash);
    }
}
