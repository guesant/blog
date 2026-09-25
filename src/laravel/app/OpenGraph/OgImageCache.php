<?php

namespace App\OpenGraph;

use Illuminate\Contracts\Cache\Factory as CacheFactory;
use Illuminate\Filesystem\Filesystem;

final class OgImageCache
{
    public function __construct(
        private readonly CacheFactory $cache,
        private readonly Filesystem $filesystem,
    ) {}

    public function get(string $key): ?string
    {
        $path = $this->path($key);
        if (! is_file($path)) {
            return null;
        }

        if (filemtime($path) + $this->ttl() < time()) {
            $this->filesystem->delete($path);

            return null;
        }

        $contents = file_get_contents($path);
        if (! is_string($contents)) {
            return null;
        }

        touch($path);

        return $contents;
    }

    public function put(string $key, string $contents): void
    {
        $directory = $this->directory();
        if (! is_dir($directory)) {
            mkdir($directory, 0770, true);
        }

        $lock = $this->cache->store()->lock('og:image-cache-write', 10);
        $lock->block(2, function () use ($key, $contents, $directory): void {
            $temporary = tempnam($directory, 'og-');
            if ($temporary === false) {
                throw new \RuntimeException('The OG image cache temporary file could not be created.');
            }

            try {
                if (file_put_contents($temporary, $contents, LOCK_EX) === false) {
                    throw new \RuntimeException('The OG image cache could not be written.');
                }

                rename($temporary, $this->path($key));
                $this->evict($key);
            } finally {
                if (is_file($temporary)) {
                    $this->filesystem->delete($temporary);
                }
            }
        });
    }

    private function evict(string $currentKey): void
    {
        $files = glob($this->directory().'/*.png') ?: [];
        $now = time();
        $entries = [];

        foreach ($files as $file) {
            $modified = filemtime($file);
            if ($modified === false || $modified + $this->ttl() < $now) {
                $this->filesystem->delete($file);

                continue;
            }

            $entries[] = [
                'path' => $file,
                'key' => pathinfo($file, PATHINFO_FILENAME),
                'modified' => $modified,
                'size' => filesize($file) ?: 0,
            ];
        }

        usort($entries, static fn (array $left, array $right): int => $left['modified'] <=> $right['modified']);

        $bytes = array_sum(array_column($entries, 'size'));
        $maxBytes = max(1, (int) config('og.cache_max_bytes'));
        $maxEntries = max(1, (int) config('og.cache_max_entries'));

        while ($entries !== [] && ($bytes > $maxBytes || count($entries) > $maxEntries)) {
            $entry = array_shift($entries);
            if ($entry['key'] === $currentKey && count($entries) > 1) {
                $entries[] = $entry;

                continue;
            }

            $bytes -= $entry['size'];
            $this->filesystem->delete($entry['path']);
        }
    }

    private function path(string $key): string
    {
        if (preg_match('/\A[a-f0-9]{64}\z/D', $key) !== 1) {
            throw new \InvalidArgumentException('The OG cache key is invalid.');
        }

        return $this->directory().'/'.$key.'.png';
    }

    private function directory(): string
    {
        return rtrim((string) config('og.cache_path'), '/');
    }

    private function ttl(): int
    {
        return max(1, (int) config('og.cache_ttl'));
    }
}
