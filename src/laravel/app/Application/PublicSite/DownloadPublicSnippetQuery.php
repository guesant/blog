<?php

namespace App\Application\PublicSite;

final readonly class DownloadPublicSnippetQuery
{
    public function __construct(
        public string $slug,
        public array $selectedFileIds,
    ) {}
}
