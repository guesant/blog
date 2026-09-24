<?php

namespace App\ReadModel\PublicSite\Content;

use App\Application\PublicSite\GetPublicHomeGalleryQueryResult;
use App\Models\Page;

final class HomeGalleryReader
{
    private const LIMIT = 6;

    public function __construct(
        private readonly CaseStudyReader $cases,
        private readonly CreditsReader $credits,
        private readonly FeedReader $feed,
        private readonly ProjectReader $projects,
        private readonly ReferenceCollectionReader $collections,
        private readonly SnippetReader $snippets,
        private readonly TechnologyReader $technologies,
        private readonly TopicReader $topics,
    ) {}

    public function find(string $locale): GetPublicHomeGalleryQueryResult
    {
        $recent = [
            'writing' => $this->feedItems($locale, 'desc', 'post'),
            'finding' => $this->feedItems($locale, 'desc', 'achado'),
            'collection' => $this->feedItems($locale, 'desc', 'colecao'),
        ];
        $popular = [
            'writing' => [],
            'finding' => $this->feedItems($locale, 'popular', 'achado'),
            'collection' => [],
        ];
        $collections = $this->collections->listPaginated(self::LIMIT, 'desc', $locale)->getCollection()->all();
        $portfolio = [
            'cases' => $this->cases->listPaginated(self::LIMIT, 'desc')->getCollection()->all(),
            'projects' => $this->projects->listPaginated(self::LIMIT, 'desc')->getCollection()->all(),
            'experiments' => $this->projects->listExperimentsPaginated(self::LIMIT, 'desc')->getCollection()->all(),
            'collections' => $collections,
            'snippets' => $this->snippets->listPaginated(self::LIMIT, 'desc')->getCollection()->all(),
            'technologies' => $this->technologies->listPaginated(self::LIMIT, 'order')->getCollection()->all(),
            'topics' => $this->topics->listPaginated(self::LIMIT, 'alpha')->getCollection()->all(),
            'credits' => $this->credits->listPaginated(self::LIMIT, 'desc')->getCollection()->all(),
        ];

        return new GetPublicHomeGalleryQueryResult(
            highlights: $this->highlights(),
            recent: $recent,
            popular: $popular,
            portfolio: $portfolio,
            collectionShowcases: array_map(
                fn ($collection): array => [
                    'collection' => $collection,
                    'resources' => $this->collections->resourcesForHome($collection, self::LIMIT)->all(),
                ],
                $collections,
            ),
        );
    }

    private function feedItems(string $locale, string $sort, string $kind): array
    {
        return $this->feed->listPaginated(
            self::LIMIT,
            1,
            $sort,
            $kind,
            $locale,
            null,
            null,
            null,
        )->getCollection()->all();
    }

    private function highlights(): array
    {
        $revision = Page::query()
            ->where('slug', 'portfolio')
            ->with([
                'currentRevision.featuredCases' => static fn ($query) => $query
                    ->where('hidden', false)
                    ->where('nda', false)
                    ->with(['translations', 'technologies.translations']),
                'currentRevision.featuredProjects' => static fn ($query) => $query
                    ->where('hidden', false)
                    ->where('nda', false)
                    ->with(['translations', 'technologies.translations']),
                'currentRevision.featuredWritings' => static fn ($query) => $query
                    ->where('hidden', false)
                    ->with(['translations', 'topics.translations']),
            ])
            ->first()?->currentRevision;

        if ($revision === null) {
            return [];
        }

        return collect()
            ->concat(collect($revision->featuredCases)->map(static fn ($item): array => ['kind' => 'cases', 'item' => $item]))
            ->concat(collect($revision->featuredProjects)->map(static fn ($item): array => ['kind' => 'projects', 'item' => $item]))
            ->concat(collect($revision->featuredWritings)->map(static fn ($item): array => ['kind' => 'writing', 'item' => $item]))
            ->take(self::LIMIT)
            ->values()
            ->all();
    }
}
