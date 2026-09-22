<?php

namespace App\Application\PublicSite;

final readonly class ListPublicContent
{
    public function __construct(
        public string $collection,
        public int $perPage,
        public ?string $sort,
        public bool $featured,
        public int $page,
    ) {}
}
