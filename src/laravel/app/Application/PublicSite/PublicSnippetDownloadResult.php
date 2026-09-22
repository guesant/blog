<?php

namespace App\Application\PublicSite;

final readonly class PublicSnippetDownloadResult
{
    public function __construct(
        public string $contents,
        public string $filename,
    ) {}
}
