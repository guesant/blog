<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\HomeGalleryReader;

final class GetPublicHomeGalleryQueryHandler
{
    public function __construct(
        private readonly HomeGalleryReader $gallery,
    ) {}

    public function handle(GetPublicHomeGalleryQuery $query): GetPublicHomeGalleryQueryResult
    {
        return $this->gallery->find($query->locale);
    }
}
