<?php

namespace App\Application\PublicSite;

use App\Content\PublicResourceQuery;

final class ListPublicFindingsHandler
{
    public function __construct(
        private readonly PublicResourceQuery $resources,
    ) {}

    public function handle(ListPublicFindings $query): PublicFindingListResult
    {
        $page = $this->resources->paginate(
            $query->filters,
            $query->locale,
            $query->perPage,
            $query->sort,
        );

        return new PublicFindingListResult(
            page: $page,
            facets: $this->resources->facetOptions($query->locale),
        );
    }
}
