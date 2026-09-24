<?php

namespace App\Application\PublicSite;

final readonly class PublicHomeGalleryReadResult
{
    public function __construct(
        public array $highlights,
        public array $recentFeed,
        public array $recentProjects,
        public array $popular,
        public array $collections,
        public array $projects,
    ) {}
}
