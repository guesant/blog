<?php

namespace App\Application\PublicSite;

final readonly class GetPublicHomeGalleryQueryResult
{
    public function __construct(
        public array $highlights,
        public array $recent,
        public array $popular,
        public array $portfolio,
        public array $collectionShowcases,
    ) {}
}
