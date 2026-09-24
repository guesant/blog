<?php

namespace App\Application\PublicSite;

use Illuminate\Pagination\LengthAwarePaginator;

final readonly class ListPublicFindingsQueryResult
{
    public function __construct(
        public LengthAwarePaginator $page,
        public array $facets,
    ) {}
}
