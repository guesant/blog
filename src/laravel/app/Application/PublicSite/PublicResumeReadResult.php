<?php

namespace App\Application\PublicSite;

final readonly class PublicResumeReadResult
{
    public function __construct(
        public ?object $profile,
        public ?object $resume,
        public string $locale,
    ) {}
}
