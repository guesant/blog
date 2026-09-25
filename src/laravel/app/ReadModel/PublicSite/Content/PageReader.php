<?php

namespace App\ReadModel\PublicSite\Content;

use App\Models\Page;

class PageReader
{
    public function findBySlug(string $slug): ?Page
    {
        return Page::where('slug', $slug)
            ->where(fn ($visibility) => $visibility
                ->where('pages.hidden', false)
                ->orWhereNull('pages.hidden'))
            ->whereHas('currentRevision', static function ($query): void {
                $query->where(fn ($visibility) => $visibility
                    ->where('hidden', false)
                    ->orWhereNull('hidden'));
            })
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
