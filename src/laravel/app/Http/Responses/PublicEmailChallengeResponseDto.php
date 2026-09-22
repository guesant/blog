<?php

namespace App\Http\Responses;

use App\Application\PublicSite\PublicEmailChallengeReadResult;

final readonly class PublicEmailChallengeResponseDto
{
    private function __construct(private readonly ?array $value) {}

    public static function fromResult(PublicEmailChallengeReadResult $result): self
    {
        return new self($result->value);
    }

    public function toArray(): ?array
    {
        return $this->value;
    }
}
