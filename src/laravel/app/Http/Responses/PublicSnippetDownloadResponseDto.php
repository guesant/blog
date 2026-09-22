<?php

namespace App\Http\Responses;

use App\Application\PublicSite\PublicSnippetDownloadResult;

final readonly class PublicSnippetDownloadResponseDto
{
    private function __construct(
        private string $contents,
        private string $filename,
    ) {}

    public static function fromResult(PublicSnippetDownloadResult $result): self
    {
        return new self($result->contents, $result->filename);
    }

    public function contents(): string
    {
        return $this->contents;
    }

    public function filename(): string
    {
        return $this->filename;
    }
}
