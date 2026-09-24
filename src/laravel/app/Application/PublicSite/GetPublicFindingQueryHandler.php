<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\PublicResourceReader;

final class GetPublicFindingQueryHandler
{
    public function __construct(
        private readonly PublicResourceReader $resources,
    ) {}

    public function handle(GetPublicFindingQuery $query): ?GetPublicFindingQueryResult
    {
        $resource = $this->resources->findByIdentifier($query->identifier, $query->locale);

        return $resource === null ? null : new GetPublicFindingQueryResult($resource);
    }
}
