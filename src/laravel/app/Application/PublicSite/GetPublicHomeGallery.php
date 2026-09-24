<?php

namespace App\Application\PublicSite;

final readonly class GetPublicHomeGallery
{
    public function __construct(
        public string $locale,
    ) {}
}
