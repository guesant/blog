<?php

namespace App\Http\Responses;

use App\Application\PublicSite\PublicPageReadResult;

final readonly class PublicPageResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(PublicPageReadResult $result): self
    {
        return new self($result->fields);
    }

    public function toArray(): array
    {
        return $this->value;
    }
}
