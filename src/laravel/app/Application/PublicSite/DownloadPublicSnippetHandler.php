<?php

namespace App\Application\PublicSite;

use App\Support\SnippetArchiveBuilder;

final class DownloadPublicSnippetHandler
{
    public function __construct(
        private readonly PublicSnippetReader $snippets,
        private readonly SnippetArchiveBuilder $archives,
    ) {}

    public function handle(DownloadPublicSnippet $query): ?PublicSnippetDownloadResult
    {
        $snippet = $this->snippets->findForDownload($query->slug);
        if ($snippet === null) {
            return null;
        }

        if (! is_object($snippet)) {
            return null;
        }

        return new PublicSnippetDownloadResult(
            contents: $this->archives->build($snippet, $query->selectedFileIds),
            filename: $snippet->slug.'.zip',
        );
    }
}
