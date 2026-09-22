<?php

namespace App\Application\PublicSite;

final readonly class GetPublicPage
{
    public function __construct(
        public string $slug,
        public string $locale,
    ) {}
}
