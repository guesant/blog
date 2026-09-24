<?php

namespace App\Application\PublicSite;

final readonly class GetPublicResumeQueryResult
{
    public function __construct(
        public ?object $profile,
        public ?object $resume,
        public string $locale,
    ) {}
}
