<?php

namespace App\Content;

use Illuminate\Support\Facades\Cache;

final class PublicSiteChromeCache
{
    public const VERSION = 'v1';

    public const TTL_MINUTES = 5;

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

    public function forgetAll(): void
    {
        foreach (Locale::all() as $locale) {
            Cache::forget($this->key($locale));
        }
    }
}
