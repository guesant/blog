<?php

namespace App\Application\PublicSite;

use App\Application\PublicSite\Ports\PublicSiteChromeReader;

final class GetPublicSiteChromeQueryHandler
{
    public function __construct(
        private readonly PublicSiteChromeReader $reader,
    ) {}

    public function handle(GetPublicSiteChromeQuery $query): GetPublicSiteChromeQueryResult
    {
        return $this->reader->read($query);
    }
}
