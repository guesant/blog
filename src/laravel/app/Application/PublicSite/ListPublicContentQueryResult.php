<?php

namespace App\Application\PublicSite;

use Illuminate\Pagination\LengthAwarePaginator;

final readonly class ListPublicContentQueryResult
{
    public function __construct(
        public LengthAwarePaginator $page,
        public string $collection,
    ) {}
}
