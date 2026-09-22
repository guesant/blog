<?php

namespace App\Console\Commands;

use App\Application\PublicSite\GetPublicSiteChrome;
use App\Application\PublicSite\GetPublicSiteChromeHandler;
use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Http\Responses\PublicSiteChromeResponseDto;
use Illuminate\Console\Command;

class WarmPublicSiteChrome extends Command
{
    protected $signature = 'public-site:cache-warm';

    protected $description = 'Warm the public site chrome cache';

    public function handle(PublicSiteChromeCache $cache, GetPublicSiteChromeHandler $handler): int
    {
        foreach (Locale::all() as $locale) {
            $cache->put($locale, PublicSiteChromeResponseDto::fromResult(
                $handler->handle(new GetPublicSiteChrome($locale)),
            )->toArray());
        }

        return self::SUCCESS;
    }
}
