<?php

namespace App\Application\PublicSite;

final readonly class GetPublicHomeGalleryQueryResult
{
    public function __construct(
        public array $highlights,
        public array $feed,
        public array $portfolio,
        public array $collectionShowcases,
        public array $totals,
    ) {}
}
