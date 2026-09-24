<?php

namespace App\Application\PublicSite\Ports;

use App\Application\PublicSite\GetPublicSiteChromeQuery;
use App\Application\PublicSite\GetPublicSiteChromeQueryResult;

interface PublicSiteChromeReader
{
    public function read(GetPublicSiteChromeQuery $query): GetPublicSiteChromeQueryResult;
}
