<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\PublicResourceReader;

final class ListPublicFindingsQueryHandler
{
    public function __construct(
        private readonly PublicResourceReader $resources,
    ) {}

    public function handle(ListPublicFindingsQuery $query): ListPublicFindingsQueryResult
    {
        $page = $this->resources->paginate(
            $query->filters,
            $query->locale,
            $query->perPage,
            $query->sort,
        );

        return new ListPublicFindingsQueryResult(
            page: $page,
            facets: $this->resources->facetOptions($query->locale),
        );
    }
}
