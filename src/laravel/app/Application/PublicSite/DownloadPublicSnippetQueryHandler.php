<?php

namespace App\Application\PublicSite;

use App\Application\PublicSite\Ports\PublicSnippetReader;
use App\Support\SnippetArchiveBuilder;

final class DownloadPublicSnippetQueryHandler
{
    public function __construct(
        private readonly PublicSnippetReader $snippets,
        private readonly SnippetArchiveBuilder $archives,
    ) {}

    public function handle(DownloadPublicSnippetQuery $query): ?DownloadPublicSnippetQueryResult
    {
        $snippet = $this->snippets->findForDownload($query->slug);
        if ($snippet === null) {
            return null;
        }

        if (! is_object($snippet)) {
            return null;
        }

        return new DownloadPublicSnippetQueryResult(
            contents: $this->archives->build($snippet, $query->selectedFileIds),
            filename: $snippet->slug.'.zip',
        );
    }
}
