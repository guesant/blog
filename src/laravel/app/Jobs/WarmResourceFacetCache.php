<?php

namespace App\Jobs;

use App\Content\Locale;
use App\Content\ResourceQuery;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class WarmResourceFacetCache implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $timeout = 60;

    public int $tries = 1;

    public int $uniqueFor = 300;

    public function handle(ResourceQuery $query): void
    {
        foreach (Locale::all() as $locale) {
            Cache::put(
                "resource-facets:v2:{$locale}",
                $query->buildFacetOptions($locale),
                now()->addMinutes(15),
            );
        }
    }
}
