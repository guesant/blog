<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Chrome\PublicSiteChromeReader;
use App\ReadModel\PublicSite\Chrome\PublicSiteChromeResult;

final class GetPublicSiteChromeHandler
{
    public function __construct(
        private readonly PublicSiteChromeReader $reader,
    ) {}

    public function handle(GetPublicSiteChrome $query): PublicSiteChromeResult
    {
        return $this->reader->read($query);
    }
}
