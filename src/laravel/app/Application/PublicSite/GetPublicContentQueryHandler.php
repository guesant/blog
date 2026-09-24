<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\CaseStudyReader;
use App\ReadModel\PublicSite\Content\ProjectReader;
use App\ReadModel\PublicSite\Content\ReferenceCollectionReader;
use App\ReadModel\PublicSite\Content\SnippetReader;
use App\ReadModel\PublicSite\Content\TechnologyReader;
use App\ReadModel\PublicSite\Content\TopicReader;
use App\ReadModel\PublicSite\Content\WritingReader;

final class GetPublicContentQueryHandler
{
    public function __construct(
        private readonly CaseStudyReader $cases,
        private readonly ProjectReader $projects,
        private readonly ReferenceCollectionReader $collections,
        private readonly SnippetReader $snippets,
        private readonly TechnologyReader $technologies,
        private readonly TopicReader $topics,
        private readonly WritingReader $writing,
    ) {}

    public function handle(GetPublicContentQuery $query): ?GetPublicContentQueryResult
    {
        $item = match ($query->collection) {
            'cases' => $this->cases->findByIdentifier($query->identifier),
            'collections' => $this->collections->findByIdentifier($query->identifier),
            'experiments' => $this->projects->findExperimentByIdentifier($query->identifier),
            'projects' => $this->projects->findByIdentifier($query->identifier),
            'snippets' => $this->snippets->findByIdentifier($query->identifier),
            'technologies' => $this->technologies->findByIdentifier($query->identifier),
            'topics' => $this->topics->findByIdentifier($query->identifier),
            'writing' => $this->writing->findByIdentifier($query->identifier),
            default => null,
        };

        if ($item === null) {
            return null;
        }

        $resources = $query->collection === 'collections'
            ? $this->collections->resourcesPaginated($item, $query->perPage, $query->page)
            : null;

        return new GetPublicContentQueryResult($item, $resources);
    }
}
