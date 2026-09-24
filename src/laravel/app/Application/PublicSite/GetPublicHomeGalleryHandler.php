<?php

namespace App\Application\PublicSite;

use App\Content\HomeGalleryQuery;

final class GetPublicHomeGalleryHandler
{
    public function __construct(
        private readonly HomeGalleryQuery $gallery,
    ) {}

    public function handle(GetPublicHomeGallery $query): PublicHomeGalleryReadResult
    {
        return $this->gallery->find($query->locale);
    }
}
