<?php

namespace App\ReadModel\PublicSite\Chrome;

use App\Application\PublicSite\GetPublicSiteChrome;

interface PublicSiteChromeReader
{
    public function read(GetPublicSiteChrome $query): PublicSiteChromeResult;
}
