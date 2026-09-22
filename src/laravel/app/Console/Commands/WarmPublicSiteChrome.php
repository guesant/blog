<?php

namespace App\Console\Commands;

use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Content\PublicSiteChromeQuery;
use Illuminate\Console\Command;

class WarmPublicSiteChrome extends Command
{
    protected $signature = 'public-site:cache-warm';

    protected $description = 'Warm the public site chrome cache';

    public function handle(PublicSiteChromeCache $cache, PublicSiteChromeQuery $query): int
    {
        foreach (Locale::all() as $locale) {
            $cache->put($locale, $query->build($locale));
        }

        return self::SUCCESS;
    }
}
