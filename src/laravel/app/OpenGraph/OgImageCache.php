<?php

namespace App\OpenGraph;

use Illuminate\Contracts\Cache\Factory as CacheFactory;
use Illuminate\Contracts\Filesystem\Factory as FilesystemFactory;
use Illuminate\Filesystem\FilesystemAdapter;

final class OgImageCache
{
    public function __construct(
        private readonly CacheFactory $cache,
        private readonly FilesystemFactory $filesystem,
    ) {}

    public function get(string $key): ?string
    {
        try {
            $disk = $this->disk();
            $path = $this->path($key);
            if (! $disk->exists($path)) {
                return null;
            }

            if ($disk->lastModified($path) + $this->ttl() < time()) {
                $disk->delete($path);

                return null;
            }

            return $disk->get($path);
        } catch (\Throwable) {
            return null;
        }
    }

    public function put(string $key, string $contents): void
    {
        try {
            $lock = $this->cache->store()->lock('og:image-cache-write', 10);
            $lock->block(2, function () use ($key, $contents): void {
                if (! $this->disk()->put($this->path($key), $contents)) {
                    throw new \RuntimeException('The OG image cache could not be written.');
                }

                $this->evict($key);
            });
        } catch (\Throwable) {
            return;
        }
    }

    private function evict(string $currentKey): void
    {
        $disk = $this->disk();
        $files = $disk->files($this->prefix());
        $now = time();
        $entries = [];

        foreach ($files as $file) {
            $modified = $disk->lastModified($file);
            if ($modified + $this->ttl() < $now) {
                $disk->delete($file);

                continue;
            }

            $entries[] = [
                'path' => $file,
                'key' => pathinfo($file, PATHINFO_FILENAME),
                'modified' => $modified,
                'size' => $disk->size($file),
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
            $disk->delete($entry['path']);
        }
    }

    private function path(string $key): string
    {
        if (preg_match('/\A[a-f0-9]{64}\z/D', $key) !== 1) {
            throw new \InvalidArgumentException('The OG cache key is invalid.');
        }

        return $this->prefix().'/'.$key.'.png';
    }

    private function disk(): FilesystemAdapter
    {
        return $this->filesystem->disk((string) config('og.cache_disk'));
    }

    private function prefix(): string
    {
        return trim((string) config('og.cache_prefix'), '/');
    }

    private function ttl(): int
    {
        return max(1, (int) config('og.cache_ttl'));
    }
}
