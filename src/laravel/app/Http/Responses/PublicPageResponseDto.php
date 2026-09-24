<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicPageQueryResult;

final readonly class PublicPageResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromResult(GetPublicPageQueryResult $result): self
    {
        return new self($result->fields);
    }

    public function toArray(): array
    {
        return $this->value;
    }
}
