<?php

namespace App\Http\Responses;

final readonly class PublicFindingResponseDto
{
    private function __construct(
        private array $value,
    ) {}

    public static function fromArray(array $value): self
    {
        return new self($value);
    }

    public function toArray(): array
    {
        return $this->value;
    }
}
