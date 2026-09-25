<?php

namespace App\OpenGraph;

use Illuminate\Contracts\Cache\Factory as CacheFactory;
use Illuminate\Contracts\Cache\Lock;
use Illuminate\Contracts\Cache\LockTimeoutException;

final class OgRenderCoordinator
{
    public function __construct(
        private readonly CacheFactory $cache,
        private readonly OgImageCache $images,
        private readonly OgImageRenderer $renderer,
    ) {}

    public function render(OgPayload $payload, string $encodedPayload): string
    {
        $key = hash('sha256', $encodedPayload);
        $cached = $this->images->get($key);
        if ($cached !== null) {
            return $cached;
        }

        $singleFlight = $this->cache->store()->lock(
            'og:render:'.$key,
            max(1, (int) config('og.render_lock_seconds')),
        );

        try {
            $singleFlight->block(max(0, (float) config('og.queue_wait_seconds')));
        } catch (LockTimeoutException $exception) {
            throw new OgRenderCapacityException('The OG render is already queued.', previous: $exception);
        }

        try {
            $cached = $this->images->get($key);
            if ($cached !== null) {
                return $cached;
            }

            if (! $this->enterQueue()) {
                throw new OgRenderCapacityException('The OG render queue is full.');
            }

            try {
                $slot = $this->acquireSlot();
                try {
                    $startedAt = hrtime(true);
                    $contents = $this->renderer->render($payload);
                    $elapsedSeconds = (hrtime(true) - $startedAt) / 1_000_000_000;
                    if ($elapsedSeconds > max(0.001, (float) config('og.render_timeout_seconds'))) {
                        throw new OgRenderTimeoutException('The OG render exceeded its time limit.');
                    }

                    $this->images->put($key, $contents);

                    return $contents;
                } finally {
                    $slot->release();
                }
            } finally {
                $this->leaveQueue();
            }
        } finally {
            $singleFlight->release();
        }
    }

    private function acquireSlot(): Lock
    {
        $deadline = microtime(true) + max(0, (float) config('og.queue_wait_seconds'));
        $count = max(1, (int) config('og.max_concurrent_renders'));

        do {
            for ($index = 0; $index < $count; $index++) {
                $slot = $this->cache->store()->lock(
                    'og:render:slot:'.$index,
                    max(1, (int) config('og.render_lock_seconds')),
                );

                if ($slot->get()) {
                    return $slot;
                }
            }

            usleep(50_000);
        } while (microtime(true) < $deadline);

        throw new OgRenderCapacityException('The OG render capacity is exhausted.');
    }

    private function enterQueue(): bool
    {
        $lock = $this->cache->store()->lock('og:render:queue-counter', 5);

        try {
            return (bool) $lock->block(1, function (): bool {
                $current = (int) $this->cache->store()->get('og:render:queue-count', 0);
                $maximum = max(0, (int) config('og.max_queued_renders'));
                if ($current >= $maximum) {
                    return false;
                }

                $this->cache->store()->put('og:render:queue-count', $current + 1, 30);

                return true;
            });
        } catch (LockTimeoutException) {
            return false;
        }
    }

    private function leaveQueue(): void
    {
        $lock = $this->cache->store()->lock('og:render:queue-counter', 5);

        try {
            $lock->block(1, function (): void {
                $current = (int) $this->cache->store()->get('og:render:queue-count', 0);
                $this->cache->store()->put('og:render:queue-count', max(0, $current - 1), 30);
            });
        } catch (LockTimeoutException) {
        }
    }
}
