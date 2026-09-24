<?php

namespace App\Http\Responses;

use App\Application\PublicSite\GetPublicSiteChromeQueryResult;

final readonly class PublicSiteChromeResponseDto
{
    private function __construct(
        private GetPublicSiteChromeQueryResult $result,
    ) {}

    public static function fromResult(GetPublicSiteChromeQueryResult $result): self
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
