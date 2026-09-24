<?php

namespace App\Application\PublicSite;

final readonly class GetPublicPageQuery
{
    public function __construct(
        public string $slug,
        public string $locale,
    ) {}
}
