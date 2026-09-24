<?php

namespace App\Application\PublicSite;

final readonly class GetPublicHomeGalleryQuery
{
    public function __construct(
        public string $locale,
    ) {}
}
