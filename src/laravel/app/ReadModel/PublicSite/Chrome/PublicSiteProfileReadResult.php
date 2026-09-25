<?php

namespace App\ReadModel\PublicSite\Chrome;

final readonly class PublicSiteProfileReadResult
{
    public function __construct(
        public ?array $profile,
        public bool $isPublic,
    ) {}
}
