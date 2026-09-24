<?php

namespace App\Application\PublicSite;

final readonly class GetPublicResumeQuery
{
    public function __construct(public string $locale) {}
}
