<?php

namespace App\Application\PublicSite;

interface PublicSnippetReader
{
    public function findForDownload(string $slug): mixed;
}
