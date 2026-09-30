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
            ->with([
                'publishedTranslations',
                'publishedRevision',
                'publishedRevision.featuredCases' => static fn ($query) => $query
                    ->published()
                    ->whereHas('publishedRevision', static fn ($revision) => $revision->where('nda', false)),
                'publishedRevision.featuredCases.technologies' => static fn ($query) => $query->published(),
                'publishedRevision.featuredCases.technologies.publishedTranslations',
                'publishedRevision.featuredProjects' => static fn ($query) => $query
                    ->published()
                    ->whereHas('publishedRevision', static fn ($revision) => $revision->where('nda', false)),
                'publishedRevision.featuredProjects.technologies' => static fn ($query) => $query->published(),
                'publishedRevision.featuredProjects.technologies.publishedTranslations',
                'publishedRevision.featuredWritings' => static fn ($query) => $query->published(),
                'publishedRevision.featuredWritings.topics' => static fn ($query) => $query->published(),
                'publishedRevision.featuredWritings.topics.publishedTranslations',
            ])
            ->first();
    }
}
