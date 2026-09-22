<?php

namespace App\Http\Responses;

use App\ReadModel\PublicSite\Chrome\PublicSiteChromeResult;

final readonly class PublicSiteChromeResponseDto
{
    private function __construct(
        private PublicSiteChromeResult $result,
    ) {}

    public static function fromResult(PublicSiteChromeResult $result): self
    {
        return new self($result);
    }

    public function toArray(): array
    {
        return [
            'site' => $this->result->site,
            'profile' => $this->result->profile,
            'copyright' => $this->result->copyright,
            'navigation' => $this->result->navigation,
            'build' => $this->result->build,
            'visibility' => $this->result->visibility,
        ];
    }
}
