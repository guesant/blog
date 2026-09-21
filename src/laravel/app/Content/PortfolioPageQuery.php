<?php

namespace App\Content;

class PortfolioPageQuery
{
    public function build(?string $locale = null): array
    {
        $page = (new PageQuery)->findBySlug('portfolio');

        // Featured items are curated by reference (pivot), but a reference to
        // a since-hidden item must not resurrect it on the portfolio page —
        // the same visibility rule the list pages (*Query::list()) apply.
        $cases = $page?->featuredCases
            ->where('hidden', false)
            ->where('nda', false)
            ->sortBy('pivot.order')
            ->values()
            ->take(3) ?? collect();

        $projects = $page?->featuredProjects
            ->where('hidden', false)
            ->where('nda', false)
            ->sortBy('pivot.order')
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
