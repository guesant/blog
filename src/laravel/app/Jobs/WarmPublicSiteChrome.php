<?php

namespace App\Jobs;

use App\Application\PublicSite\GetPublicSiteChromeQuery;
use App\Application\PublicSite\GetPublicSiteChromeQueryHandler;
use App\Content\Locale;
use App\Content\PublicSiteChromeCache;
use App\Http\Responses\PublicSiteChromeResponseDto;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class WarmPublicSiteChrome implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $timeout = 120;

    public int $tries = 1;

    public int $uniqueFor = 300;

    public function __construct(public readonly string $locale) {}

    public function uniqueId(): string
    {
        return Locale::normalize($this->locale);
    }

    public function handle(PublicSiteChromeCache $cache, GetPublicSiteChromeQueryHandler $handler): void
    {
        $locale = Locale::normalize($this->locale);

        $cache->put($locale, PublicSiteChromeResponseDto::fromResult(
            $handler->handle(new GetPublicSiteChromeQuery($locale)),
        )->toArray());
    }
}
