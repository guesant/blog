<?php

namespace App\Content;

use Closure;
use Illuminate\Support\Facades\Cache;

final class PublicSiteChromeCache
{
    public const VERSION = 'v2';

    public const TTL_MINUTES = 5;

    public const LOCK_SECONDS = 15;

    public function key(string $locale): string
    {
        return 'public-site:chrome:'.self::VERSION.':'.Locale::normalize($locale);
    }

    public function get(string $locale): ?array
    {
        $value = Cache::get($this->key($locale));

        return is_array($value) ? $value : null;
    }

    public function put(string $locale, array $value): void
    {
        Cache::put($this->key($locale), $value, now()->addMinutes(self::TTL_MINUTES));
    }

    public function remember(string $locale, Closure $resolver, ?Closure $shouldCache = null): array
    {
        $value = $this->get($locale);

        if ($value !== null) {
            return $value;
        }

        $lock = Cache::lock($this->key($locale).':lock', self::LOCK_SECONDS);

        return $lock->block(self::LOCK_SECONDS, function () use ($locale, $resolver, $shouldCache): array {
            $value = $this->get($locale);

            if ($value !== null) {
                return $value;
            }

            $value = $resolver();

            if ($shouldCache === null || $shouldCache($value)) {
                $this->put($locale, $value);
            }

            return $value;
        });
    }

    public function forgetAll(): void
    {
        foreach (Locale::all() as $locale) {
            Cache::forget($this->key($locale));
        }
    }
}
