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
            'cases' => (new CaseStudyQuery)->findByIdentifier($query->identifier),
            'collections' => (new ReferenceCollectionQuery)->findByIdentifier($query->identifier),
            'experiments' => (new ProjectQuery)->findExperimentByIdentifier($query->identifier),
            'projects' => (new ProjectQuery)->findByIdentifier($query->identifier),
            'snippets' => (new SnippetQuery)->findByIdentifier($query->identifier),
            'technologies' => (new TechnologyQuery)->findByIdentifier($query->identifier),
            'topics' => (new TopicQuery)->findByIdentifier($query->identifier),
            'writing' => (new WritingQuery)->findByIdentifier($query->identifier),
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
