<?php

namespace App\Application\PublicSite\Ports;

interface PublicSnippetReader
{
    public function findForDownload(string $slug): mixed;
}
