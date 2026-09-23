<?php

namespace App\Http\Responses;

final readonly class PublicContentListResponseDto
{
    private function __construct(
        private array $data,
        private PublicListMetaDto $meta,
        private ?array $groups,
    ) {}

    public static function fromPage(array $data, PublicListMetaDto $meta, ?array $groups = null): self
    {
        return new self($data, $meta, $groups);
    }

    public function toArray(): array
    {
        $response = [
            'data' => $this->data,
            'meta' => $this->meta->toArray(),
        ];

        if ($this->groups !== null) {
            $response['groups'] = $this->groups;
        }

        return $response;
    }
}
