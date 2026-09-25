<?php

namespace App\OpenGraph;

final readonly class OgPayload
{
    public function __construct(
        public int $version,
        public string $template,
        public string $title,
        public ?string $description = null,
        public ?string $image = null,
    ) {}

    public function toArray(): array
    {
        $payload = [
            'v' => $this->version,
            'template' => $this->template,
            'title' => $this->title,
        ];

        if ($this->description !== null) {
            $payload['description'] = $this->description;
        }

        if ($this->image !== null) {
            $payload['image'] = $this->image;
        }

        return $payload;
    }
}
