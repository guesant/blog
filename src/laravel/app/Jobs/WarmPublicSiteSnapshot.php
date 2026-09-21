<?php

namespace App\Jobs;

use App\Content\Locale;
use App\Http\Controllers\Api\PublicSiteApiController;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class WarmPublicSiteSnapshot implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $timeout = 120;

    public int $tries = 1;

    public int $uniqueFor = 300;

    public function handle(PublicSiteApiController $controller): void
    {
        $revision = DB::table('content_revisions')->value('version') ?? 0;

        foreach (Locale::all() as $locale) {
            Cache::forever(
                "public-site-snapshot:v4:chrome-pages:{$revision}:{$locale}",
                $controller->buildSnapshotBody($locale),
            );
        }
    }
}
