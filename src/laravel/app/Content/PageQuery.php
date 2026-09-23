<?php

namespace App\Content;

use App\Models\Page;

class PageQuery
{
    public function findBySlug(string $slug): ?Page
    {
        return Page::where('slug', $slug)
            ->with([
                'currentRevision.translations',
                'currentRevision.featuredCases.technologies.translations',
                'currentRevision.featuredProjects.technologies.translations',
                'currentRevision.featuredWritings',
                'featuredCases.translations',
                'featuredProjects.translations',
                'featuredWritings.translations',
            ])
            ->first();
    }
}
