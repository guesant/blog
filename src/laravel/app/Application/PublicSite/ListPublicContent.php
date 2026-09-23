<?php

namespace App\Application\PublicSite;

final readonly class ListPublicContent
{
    public function __construct(
        public string $collection,
        public string $locale,
        public int $perPage,
        public ?string $sort,
        public bool $featured,
        public int $page,
        public ?string $search,
        public ?string $type,
        public ?string $topic,
        public ?string $kind,
    ) {}
}
