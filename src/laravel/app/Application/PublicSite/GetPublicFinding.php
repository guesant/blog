<?php

namespace App\Application\PublicSite;

final readonly class GetPublicFinding
{
    public function __construct(
        public string $identifier,
        public string $locale,
    ) {}
}
