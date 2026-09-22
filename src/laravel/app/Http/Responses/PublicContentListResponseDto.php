<?php

namespace App\Http\Responses;

final readonly class PublicContentListResponseDto
{
    private function __construct(
        private array $data,
        private PublicListMetaDto $meta,
    ) {}

    public static function fromPage(array $data, PublicListMetaDto $meta): self
    {
        return new self($data, $meta);
    }

    public function toArray(): array
    {
        return [
            'data' => $this->data,
            'meta' => $this->meta->toArray(),
        ];
    }
}
