<?php

namespace App\Jobs;

use App\Content\KnowledgeGraphQuery;
use App\Content\Locale;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class WarmKnowledgeGraph implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $timeout = 120;

    public int $tries = 1;

    public int $uniqueFor = 900;

    public function handle(KnowledgeGraphQuery $query): void
    {
        foreach (Locale::all() as $locale) {
            Cache::forever($query->cacheKey($locale), $query->build($locale));
        }
    }
}
