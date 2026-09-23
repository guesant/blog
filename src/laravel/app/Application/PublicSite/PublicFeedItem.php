<?php

namespace App\Application\PublicSite;

final readonly class PublicFeedItem
{
    public function __construct(
        public string $kind,
        public object $content,
    ) {}
}
