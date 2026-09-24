<?php

namespace App\Application\PublicSite;

final readonly class GetPublicSiteChromeQuery
{
    public function __construct(
        public string $locale,
    ) {}
}
