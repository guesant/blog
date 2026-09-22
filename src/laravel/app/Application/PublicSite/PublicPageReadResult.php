<?php

namespace App\Application\PublicSite;

final readonly class PublicPageReadResult
{
    public function __construct(
        public string $slug,
        public string $locale,
        public array $fields,
    ) {}
}
