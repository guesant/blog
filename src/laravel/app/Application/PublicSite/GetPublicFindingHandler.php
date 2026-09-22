<?php

namespace App\Application\PublicSite;

use App\Content\PublicResourceQuery;

final class GetPublicFindingHandler
{
    public function __construct(
        private readonly PublicResourceQuery $resources,
    ) {}

    public function handle(GetPublicFinding $query): ?PublicFindingReadResult
    {
        $resource = $this->resources->findBySlug($query->slug, $query->locale);

        return $resource === null ? null : new PublicFindingReadResult($resource);
    }
}
