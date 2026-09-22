<?php

namespace App\Application\PublicSite;

final readonly class GetPublicContent
{
    public function __construct(
        public string $collection,
        public string $slug,
        public int $perPage,
        public int $page,
        public string $locale,
    ) {}
}
