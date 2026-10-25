<?php

namespace App\ReadModel\PublicSite\Content;

use App\Models\Page;

class PageReader
{
    public function findBySlug(string $slug): ?Page
    {
        return Page::query()
            ->published()
            ->where('slug', $slug)
            ->with(['publishedTranslations', 'publishedRevision'])
            ->first();
    }
}
