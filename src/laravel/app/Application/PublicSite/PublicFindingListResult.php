<?php

namespace App\Application\PublicSite;

use Illuminate\Pagination\LengthAwarePaginator;

final readonly class PublicFindingListResult
{
    public function __construct(
        public LengthAwarePaginator $page,
        public array $facets,
    ) {}
}
