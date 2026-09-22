<?php

namespace App\Application\PublicSite;

use App\Content\CaseStudyQuery;
use App\Content\ProjectQuery;
use App\Content\ReferenceCollectionQuery;
use App\Content\SnippetQuery;
use App\Content\TechnologyQuery;
use App\Content\TopicQuery;
use App\Content\WritingQuery;

final class GetPublicContentHandler
{
    public function handle(GetPublicContent $query): ?PublicContentReadResult
    {
        $item = match ($query->collection) {
            'cases' => (new CaseStudyQuery)->findBySlug($query->slug),
            'collections' => (new ReferenceCollectionQuery)->findBySlug($query->slug),
            'experiments' => (new ProjectQuery)->findExperimentBySlug($query->slug),
            'projects' => (new ProjectQuery)->findBySlug($query->slug),
            'snippets' => (new SnippetQuery)->findBySlug($query->slug),
            'technologies' => (new TechnologyQuery)->findBySlug($query->slug),
            'topics' => (new TopicQuery)->findBySlug($query->slug),
            'writing' => (new WritingQuery)->findBySlug($query->slug),
            default => null,
        };

        if ($item === null) {
            return null;
        }

        $resources = $query->collection === 'collections'
            ? (new ReferenceCollectionQuery)->resourcesPaginated($item, $query->perPage, $query->page)
            : null;

        return new PublicContentReadResult($item, $resources);
    }
}
