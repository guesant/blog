<?php

namespace App\Application\PublicSite;

use App\ReadModel\PublicSite\Content\CaseStudyReader;
use App\ReadModel\PublicSite\Content\CreditsReader;
use App\ReadModel\PublicSite\Content\FeedReader;
use App\ReadModel\PublicSite\Content\PageReader;
use App\ReadModel\PublicSite\Content\ProjectReader;
use App\ReadModel\PublicSite\Content\ReferenceCollectionReader;
use App\ReadModel\PublicSite\Content\SnippetReader;
use App\ReadModel\PublicSite\Content\TechnologyReader;
use App\ReadModel\PublicSite\Content\TopicReader;
use App\ReadModel\PublicSite\Content\WritingReader;
use Illuminate\Pagination\LengthAwarePaginator;
use InvalidArgumentException;

final class ListPublicContentQueryHandler
{
    public function __construct(
        private readonly FeedReader $feed,
        private readonly CaseStudyReader $cases,
        private readonly CreditsReader $credits,
        private readonly PageReader $pages,
        private readonly ProjectReader $projects,
        private readonly ReferenceCollectionReader $collections,
        private readonly SnippetReader $snippets,
        private readonly TechnologyReader $technologies,
        private readonly TopicReader $topics,
        private readonly WritingReader $writing,
    ) {}

    public function handle(ListPublicContentQuery $query): ListPublicContentQueryResult
    {
        $page = $query->featured ? $this->featured($query) : match ($query->collection) {
            'feed' => $this->feed->listPaginated(
                perPage: $query->perPage,
                page: $query->page,
                sort: $query->sort,
                kind: $query->kind,
                locale: $query->locale,
                search: $query->search,
                type: $query->type,
                topic: $query->topic,
            ),
            'cases' => $this->cases->listPaginated($query->perPage, $query->sort),
            'collections' => $this->collections->listPaginated(
                $query->perPage,
                $query->sort,
                $query->locale,
                $query->search,
            ),
            'credits' => $this->credits->listPaginated($query->perPage, $query->sort),
            'experiments' => $this->projects->listExperimentsPaginated($query->perPage, $query->sort),
            'projects' => $this->projects->listPaginated($query->perPage, $query->sort),
            'snippets' => $this->snippets->listPaginated($query->perPage, $query->sort),
            'technologies' => $this->technologies->listPaginated($query->perPage, $query->sort),
            'topics' => $this->topics->listPaginated($query->perPage, $query->sort),
            'writing' => $this->writing->listPaginated(
                $query->perPage,
                $query->sort,
                $query->locale,
                $query->search,
                $query->topic,
            ),
            default => throw new InvalidArgumentException('Unsupported public content collection.'),
        };

        return new ListPublicContentQueryResult($page, $query->collection);
    }

    private function featured(ListPublicContentQuery $query): LengthAwarePaginator
    {
        $configuration = match ($query->collection) {
            'cases' => [
                'relation' => 'featuredCases',
                'pivot' => 'page_revision_featured_cases',
                'table' => 'case_studies',
                'with' => ['translations', 'technologies.translations'],
            ],
            'projects' => [
                'relation' => 'featuredProjects',
                'pivot' => 'page_revision_featured_projects',
                'table' => 'projects',
                'with' => ['translations', 'technologies.translations'],
            ],
            'writing' => [
                'relation' => 'featuredWritings',
                'pivot' => 'page_revision_featured_writings',
                'table' => 'writings',
                'with' => ['translations', 'topics.translations'],
            ],
            default => throw new InvalidArgumentException('Featured content is unavailable for this collection.'),
        };
        $portfolio = $this->pages->findBySlug('portfolio')?->currentRevision;

        if ($portfolio === null) {
            return new LengthAwarePaginator([], 0, $query->perPage, max(1, $query->page));
        }

        $builder = $portfolio->{$configuration['relation']}()
            ->where('hidden', false)
            ->with($configuration['with'])
            ->when($query->collection === 'cases', fn ($builder) => $builder->where('nda', false));
        $pivot = $configuration['pivot'];

        return $builder
            ->orderByRaw("CASE WHEN {$pivot}.sort_order IS NULL THEN 0 ELSE 1 END")
            ->orderBy("{$pivot}.sort_order")
            ->orderBy("{$configuration['table']}.id")
            ->paginate($query->perPage, ['*'], 'page', max(1, $query->page));
    }
}
