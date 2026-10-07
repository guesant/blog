<?php

namespace App\Content;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

final class PublicFeedCache
{
    public const VERSION = 'v1';

    public const LOCK_SECONDS = 15;

    private const GENERATION_KEY = 'public-feed:'.self::VERSION.':generation';

    public function key(string $scope, array $parameters = []): string
    {
        return 'public-feed:'.self::VERSION.':'.$this->generation().':'.$scope.':'.hash(
            'sha256',
            json_encode($parameters, JSON_THROW_ON_ERROR),
        );
    }

    public function rememberArray(
        string $scope,
        array $parameters,
        int $ttlSeconds,
        Closure $resolver,
    ): array {
        $value = $this->remember($scope, $parameters, $ttlSeconds, $resolver);

        return is_array($value) ? $value : [];
    }

    public function rememberString(
        string $scope,
        array $parameters,
        int $ttlSeconds,
        Closure $resolver,
    ): string {
        $value = $this->remember($scope, $parameters, $ttlSeconds, $resolver);

        return is_string($value) ? $value : '';
    }

    public function invalidate(): void
    {
        Cache::forget(self::GENERATION_KEY);
    }

    private function remember(string $scope, array $parameters, int $ttlSeconds, Closure $resolver): mixed
    {
        $key = $this->key($scope, $parameters);
        $value = Cache::get($key);

        if ($value !== null) {
            return $value;
        }

        $lock = Cache::lock($key.':lock', self::LOCK_SECONDS);

        return $lock->block(self::LOCK_SECONDS, function () use ($key, $ttlSeconds, $resolver): mixed {
            $value = Cache::get($key);

            if ($value !== null) {
                return $value;
            }

            $value = $resolver();
            Cache::put($key, $value, now()->addSeconds($ttlSeconds));

            return $value;
        });
    }

    private function generation(): string
    {
        return (string) Cache::rememberForever(
            self::GENERATION_KEY,
            static fn (): string => Str::uuid()->toString(),
        );
    }
}
