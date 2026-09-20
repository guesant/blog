<?php

namespace App\Jobs;

use App\Content\OpenGraphMetadata;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class FetchOpenGraphMetadata implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $timeout = 10;

    public int $tries = 1;

    public int $uniqueFor = 3600;

    public function __construct(public readonly string $url) {}

    public function uniqueId(): string
    {
        return hash('sha256', $this->url);
    }

    public function handle(OpenGraphMetadata $metadata): void
    {
        $metadata->refresh($this->url);
    }
}
