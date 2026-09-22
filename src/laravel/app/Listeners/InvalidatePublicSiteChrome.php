<?php

namespace App\Listeners;

use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Events\PublicSiteContentChanged;
use App\Jobs\WarmPublicSiteChrome;
use Illuminate\Contracts\Queue\ShouldQueue;

final class InvalidatePublicSiteChrome implements ShouldQueue
{
    public function handle(PublicSiteContentChanged $event): void
    {
        app(PublicSiteChromeCache::class)->forgetAll();

        foreach (Locale::all() as $locale) {
            WarmPublicSiteChrome::dispatch($locale);
        }
    }
}
