<?php

namespace App\Application\PublicSite;

final readonly class GetPublicPageQueryResult
{
    public function __construct(
        public string $slug,
        public string $locale,
        public array $fields,
    ) {}
}
