<?php

namespace App\ReadModel\PublicSite\Chrome;

final readonly class PublicSiteChromeResult
{
    public function __construct(
        public array $site,
        public ?array $profile,
        public string $copyright,
        public array $navigation,
        public array $build,
        public array $visibility,
    ) {}
}
