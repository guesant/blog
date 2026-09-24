<?php

namespace App\Content;

use App\Application\PublicSite\PublicHomeGalleryReadResult;
use App\Models\Page;

final class HomeGalleryQuery
{
    private const LIMIT = 6;

    public function __construct(
        private readonly FeedQuery $feed,
        private readonly ProjectQuery $projects,
        private readonly ReferenceCollectionQuery $collections,
    ) {}

    public function find(string $locale): PublicHomeGalleryReadResult
    {
        $recentFeed = $this->feed->listPaginated(
            self::LIMIT,
            1,
            'desc',
            null,
            $locale,
            null,
            null,
            null,
        )->getCollection()->all();
        $popular = $this->feed->listPaginated(
            self::LIMIT,
            1,
            'popular',
            'achado',
            $locale,
            null,
            null,
            null,
        )->getCollection()->all();
        $projects = $this->projects->listPaginated(self::LIMIT, 'desc')->getCollection()->all();
        $collections = $this->collections->listPaginated(self::LIMIT, 'desc', $locale)->getCollection()->all();

        return new PublicHomeGalleryReadResult(
            highlights: $this->highlights(),
            recentFeed: $recentFeed,
            recentProjects: $projects,
            popular: $popular,
            collections: $collections,
            projects: $projects,
        );
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
