<?php

namespace App\Application\PublicSite;

final readonly class DownloadPublicSnippetQueryResult
{
    public function __construct(
        public string $contents,
        public string $filename,
    ) {}
}
