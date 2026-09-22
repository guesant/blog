<?php

namespace App\Application\PublicSite;

final readonly class PublicEmailChallengeReadResult
{
    public function __construct(public ?array $value) {}
}
