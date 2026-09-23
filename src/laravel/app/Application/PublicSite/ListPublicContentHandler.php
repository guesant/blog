<?php

namespace App\Application\PublicSite;

use App\Content\CaseStudyQuery;
use App\Content\CreditsQuery;
use App\Content\FeedQuery;
use App\Content\ProjectQuery;
use App\Content\ReferenceCollectionQuery;
use App\Content\SnippetQuery;
use App\Content\TechnologyQuery;
use App\Content\TopicQuery;
use App\Content\WritingQuery;
use App\Models\Page;
use Illuminate\Pagination\LengthAwarePaginator;
use InvalidArgumentException;

final class ListPublicContentHandler
{
    public function __construct(
        private readonly FeedQuery $feed,
    ) {}

    public function handle(ListPublicContent $query): PublicContentListResult
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
            'cases' => (new CaseStudyQuery)->listPaginated($query->perPage, $query->sort),
            'collections' => (new ReferenceCollectionQuery)->listPaginated(
                $query->perPage,
                $query->sort,
                $query->locale,
                $query->search,
            ),
            'credits' => (new CreditsQuery)->listPaginated($query->perPage, $query->sort),
            'experiments' => (new ProjectQuery)->listExperimentsPaginated($query->perPage, $query->sort),
            'projects' => (new ProjectQuery)->listPaginated($query->perPage, $query->sort),
            'snippets' => (new SnippetQuery)->listPaginated($query->perPage, $query->sort),
            'technologies' => (new TechnologyQuery)->listPaginated($query->perPage, $query->sort),
            'topics' => (new TopicQuery)->listPaginated($query->perPage, $query->sort),
            'writing' => (new WritingQuery)->listPaginated(
                $query->perPage,
                $query->sort,
                $query->locale,
                $query->search,
                $query->topic,
            ),
            default => throw new InvalidArgumentException('Unsupported public content collection.'),
        };

        return new PublicContentListResult($page, $query->collection);
    }

    private function featured(ListPublicContent $query): LengthAwarePaginator
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
        $portfolio = Page::where('slug', 'portfolio')->with('currentRevision')->first()?->currentRevision;

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
