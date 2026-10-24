<?php

namespace App\Application\PublicSite;

final readonly class GetPublicContentQuery
{
    public function __construct(
        public string $collection,
        public string $identifier,
        public string $locale,
    ) {}
}
