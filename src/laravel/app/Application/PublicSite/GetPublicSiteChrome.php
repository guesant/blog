<?php

namespace App\Application\PublicSite;

final readonly class GetPublicSiteChrome
{
    public function __construct(
        public string $locale,
    ) {}
}
