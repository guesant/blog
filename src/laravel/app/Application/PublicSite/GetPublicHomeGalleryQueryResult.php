<?php

namespace App\Application\PublicSite;

final readonly class GetPublicHomeGalleryQueryResult
{
    public function __construct(
        public array $feed,
        public array $collectionShowcases,
        public array $totals,
    ) {}
}
