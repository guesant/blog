<?php

namespace App\Console\Commands;

use App\Application\PublicSite\GetPublicSiteChromeQuery;
use App\Application\PublicSite\GetPublicSiteChromeQueryHandler;
use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Http\Responses\PublicSiteChromeResponseDto;
use Illuminate\Console\Command;

class WarmPublicSiteChrome extends Command
{
    protected $signature = 'public-site:cache-warm';

    protected $description = 'Warm the public site chrome cache';

    public function handle(PublicSiteChromeCache $cache, GetPublicSiteChromeQueryHandler $handler): int
    {
        foreach (Locale::all() as $locale) {
            $cache->put($locale, PublicSiteChromeResponseDto::fromResult(
                $handler->handle(new GetPublicSiteChromeQuery($locale)),
            )->toArray());
        }

        return self::SUCCESS;
    }
}
