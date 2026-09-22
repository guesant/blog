<?php

namespace App\Application\PublicSite;

final readonly class ListPublicFindings
{
    public function __construct(
        public array $filters,
        public string $locale,
        public int $perPage,
        public ?string $sort,
    ) {}
}
