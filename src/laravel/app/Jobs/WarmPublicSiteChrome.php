<?php

namespace App\Jobs;

use App\Application\PublicSite\GetPublicSiteChrome;
use App\Application\PublicSite\GetPublicSiteChromeHandler;
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

    public function handle(PublicSiteChromeCache $cache, GetPublicSiteChromeHandler $handler): void
    {
        $locale = Locale::normalize($this->locale);

        $cache->put($locale, PublicSiteChromeResponseDto::fromResult(
            $handler->handle(new GetPublicSiteChrome($locale)),
        )->toArray());
    }
}
