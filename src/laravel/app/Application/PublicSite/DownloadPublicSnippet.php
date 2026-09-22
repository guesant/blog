<?php

namespace App\Application\PublicSite;

final readonly class DownloadPublicSnippet
{
    public function __construct(
        public string $slug,
        public array $selectedFileIds,
    ) {}
}
