<?php

namespace App\Content;

class PortfolioPageQuery
{
    public function build(?string $locale = null): array
    {
        $page = (new PageQuery)->findBySlug('portfolio');

        $cases = ($page?->currentRevision?->featuredCases?->isNotEmpty()
            ? $page->currentRevision->featuredCases
            : $page?->featuredCases)
            ->where('hidden', false)
            ->where('nda', false)
            ->sortBy('pivot.sort_order')
            ->values()
            ->take(3) ?? collect();

        $projects = ($page?->currentRevision?->featuredProjects?->isNotEmpty()
            ? $page->currentRevision->featuredProjects
            : $page?->featuredProjects)
            ->where('hidden', false)
            ->where('nda', false)
            ->sortBy('pivot.sort_order')
            ->values()
            ->take(3) ?? collect();

        return [
            'page' => $page,
            'cases' => $cases,
            'projects' => $projects,
            'experiments' => (new ProjectQuery)->listExperimentsPaginated(20)->getCollection(),
            'profile' => (new ProfileQuery)->find(),
            'site' => (new SiteSettingsQuery)->find(),
        ];
    }
}
