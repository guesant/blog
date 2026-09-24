<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicEmailChallengeQueryResult;

final readonly class PublicEmailChallengeResponseDto
{
    private function __construct(private readonly ?array $value) {}

    public static function fromResult(GetPublicEmailChallengeQueryResult $result): self
    {
        return new self($result->value);
    }

    public function toArray(): ?array
    {
        return $this->value;
    }
}
