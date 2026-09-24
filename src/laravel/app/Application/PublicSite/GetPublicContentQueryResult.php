<?php

namespace App\Application\PublicSite;

use Illuminate\Pagination\LengthAwarePaginator;

final readonly class GetPublicContentQueryResult
{
    public function __construct(
        public object $item,
        public ?LengthAwarePaginator $resources = null,
    ) {}
}
