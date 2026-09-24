<?php

namespace App\Application\PublicSite;

final readonly class GetPublicFindingQuery
{
    public function __construct(
        public string $identifier,
        public string $locale,
    ) {}
}
