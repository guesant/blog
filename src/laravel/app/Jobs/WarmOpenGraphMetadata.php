<?php

namespace App\Jobs;

use App\Content\OpenGraphMetadata;
use App\Models\ResourceLink;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class WarmOpenGraphMetadata implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $timeout = 120;

    public int $tries = 1;

    public int $uniqueFor = 900;

    public function handle(OpenGraphMetadata $metadata): void
    {
        if (! config('content.open_graph.enabled')) {
            return;
        }

        ResourceLink::query()
            ->select(['id', 'url'])
            ->whereNotNull('url')
            ->orderBy('id')
            ->chunkById(100, function ($links) use ($metadata): void {
                foreach ($links as $link) {
                    $metadata->queue($link->url);
                }
            });
    }
}
