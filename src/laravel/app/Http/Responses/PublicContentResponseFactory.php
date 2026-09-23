<?php

namespace App\Http\Responses;

use App\Application\PublicSite\PublicFeedItem;
use App\Content\Locale;
use App\Models\CaseStudy;
use App\Models\Experiment;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Snippet;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Pagination\LengthAwarePaginator;

final class PublicContentResponseFactory
{
    public function __construct(
        private readonly PublicFindingResponseFactory $findings,
    ) {}

    public function feedItem(PublicFeedItem $item, string $locale): array
    {
        return match ($item->kind) {
            'post' => $this->feedWriting($this->collectionItem('writing', $item->content, $locale)),
            'achado' => $this->feedFinding($this->findings->summary($item->content, $locale)),
            'colecao' => $this->feedCollection($this->collectionItem('collections', $item->content, $locale)),
        };
    }

    public function collectionItem(string $collection, object $item, string $locale): array
    {
        return match ($collection) {
            'cases' => $this->caseStudySummary($item, $locale),
            'collections' => $this->collectionSummary($item, $locale),
            'credits' => $this->credit($item, $locale),
            'experiments' => $this->experimentSummary($item, $locale),
            'projects' => $this->projectSummary($item, $locale),
            'snippets' => $this->snippetSummary($item, $locale),
            'technologies' => $this->technology($item, $locale),
            'topics' => $this->topic($item, $locale),
            'writing' => $this->writingSummary($item, $locale),
        };
    }

    public function documentItem(
        string $collection,
        object $item,
        string $locale,
        ?LengthAwarePaginator $resources,
    ): array {
        return match ($collection) {
            'cases' => $this->caseStudy($item, $locale),
            'collections' => $this->collectionDetail($item, $locale, $resources),
            'experiments' => $this->experiment($item, $locale),
            'projects' => $this->project($item, $locale),
            'snippets' => $this->snippet($item, $locale),
            'technologies' => $this->technology($item, $locale),
            'topics' => $this->topic($item, $locale),
            'writing' => $this->writing($item, $locale),
        };
    }

    private function projectSummary(Project $project, string $locale): array
    {
        return $this->withoutDetailFields($this->project($project, $locale));
    }

    private function caseStudySummary(CaseStudy $case, string $locale): array
    {
        return $this->withoutDetailFields($this->caseStudy($case, $locale));
    }

    private function writingSummary(Writing $writing, string $locale): array
    {
        return $this->withoutDetailFields($this->writing($writing, $locale));
    }

    private function experimentSummary(Experiment $experiment, string $locale): array
    {
        return $this->withoutDetailFields($this->experiment($experiment, $locale));
    }

    private function snippetSummary(Snippet $snippet, string $locale): array
    {
        $translation = $snippet->translation($locale);

        return [
            'slug' => $snippet->slug,
            'title' => $translation?->title ?? $snippet->slug,
            'description' => $translation?->description,
            'download_url' => Locale::url("/snippets/{$this->key($snippet)}/download", $locale),
            'files' => [],
            'file_count' => $snippet->files_count ?? 0,
            'updated_at' => $snippet->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function collectionSummary(ReferenceCollection $collection, string $locale): array
    {
        $translation = $collection->translation($locale);

        return [
            'slug' => $collection->slug,
            'url' => Locale::url("/collections/{$this->key($collection)}", $locale),
            'title' => $translation?->title ?? $collection->slug,
            'description' => $translation?->description,
            'intro' => $translation?->intro,
            'published_at' => $collection->published_at?->toDateString(),
            'resources_count' => $collection->resources_count ?? 0,
            'related' => null,
            'updated_at' => $collection->updated_at?->format('Y-m-d H:i:s'),
            'created_at' => $collection->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function technology(Technology $technology, string $locale): array
    {
        return [
            'slug' => $technology->slug,
            'name' => $technology->translation($locale)?->name ?? $technology->slug,
            'code' => $technology->code ?? '',
            'url' => Locale::url("/technologies/{$this->key($technology)}", $locale),
            'skills' => $technology->resumeSkills
                ->map(fn ($skill) => $skill->topic?->translation($locale)?->name ?? $skill->topic?->slug)
                ->filter()
                ->values(),
            'resume_skills' => $technology->resumeSkills->map(fn ($skill) => $skill->topic ? [
                'slug' => $skill->topic->slug,
                'name' => $skill->topic->translation($locale)?->name ?? $skill->topic->slug,
                'url' => Locale::url("/topics/{$this->key($skill->topic)}", $locale),
                'parent' => $skill->topic->parent?->slug,
                'kind' => null,
                'children' => null,
            ] : null)->filter()->unique('slug')->values(),
        ];
    }

    private function topic(Topic $topic, string $locale): array
    {
        return [
            'slug' => $topic->slug,
            'name' => $topic->translation($locale)?->name ?? $topic->slug,
            'kind' => $topic->kind === 'skill' ? 'topic' : $topic->kind,
            'parent' => $topic->parent?->slug,
            'children' => $topic->children->where('hidden', false)->map(fn ($child) => [
                'slug' => $child->slug,
                'name' => $child->translation($locale)?->name ?? $child->slug,
            ])->values(),
        ];
    }

    private function credit(object $credit, string $locale): array
    {
        return [
            'category' => $credit->category,
            'name' => $credit->translation($locale)?->name ?? $credit->category,
            'description' => $credit->translation($locale)?->description,
            'url' => $credit->url,
            'package_manager' => $credit->package_manager,
            'package_name' => $credit->package_name,
            'created_at' => $credit->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    public function creditGroups(array $credits): array
    {
        return [
            'acknowledgements' => array_values(array_filter(
                $credits,
                static fn (array $credit): bool => $credit['category'] === 'reference' && empty($credit['url']),
            )),
            'references' => array_values(array_filter(
                $credits,
                static fn (array $credit): bool => $credit['category'] === 'reference' && filled($credit['url']),
            )),
            'infrastructure' => array_values(array_filter(
                $credits,
                static fn (array $credit): bool => $credit['category'] === 'infrastructure',
            )),
            'libraries' => array_values(array_filter(
                $credits,
                static fn (array $credit): bool => in_array($credit['category'], ['library', 'font'], true),
            )),
            'tools' => array_values(array_filter(
                $credits,
                static fn (array $credit): bool => $credit['category'] === 'tool',
            )),
        ];
    }

    private function feedWriting(array $item): array
    {
        return [
            'kind' => 'post',
            'slug' => $item['slug'],
            'title' => $item['title'],
            'preview' => $item['excerpt'] ?? '',
            'date' => $item['date'] ?? '',
            'reading_time' => $item['reading_time'] ?? null,
            'topics' => $item['topics'] ?? [],
            'href' => $item['url'],
        ];
    }

    private function feedFinding(array $item): array
    {
        return [
            ...$item,
            'kind' => 'achado',
            'slug' => $item['slug'],
            'title' => $item['title'] ?? $item['slug'],
            'preview' => $item['personal_note'] ?: ($item['reason_found'] ?: ($item['description'] ?? '')),
            'date' => $item['found_date'] ?: ($item['published_date'] ?? ''),
            'finding_type' => $item['type'],
            'popularity' => $item['popularity'],
            'featured' => $item['featured'],
            'topics' => $item['topics'],
            'links' => $item['links'],
            'href' => $item['url'],
        ];
    }

    private function feedCollection(array $item): array
    {
        return [
            'kind' => 'colecao',
            'slug' => $item['slug'],
            'title' => $item['title'],
            'preview' => $item['description'] ?? '',
            'date' => $item['published_at'] ?? '',
            'topics' => [],
            'href' => $item['url'],
        ];
    }

    private function withoutDetailFields(array $data): array
    {
        unset($data['body'], $data['history'], $data['related']);

        return $data;
    }

    private function project(Project $project, string $locale): array
    {
        $translation = $project->translation($locale);

        return [
            'slug' => $project->slug,
            'url' => Locale::url("/projects/{$this->key($project)}", $locale),
            'name' => $translation?->name ?? $project->slug,
            'purpose' => $translation?->purpose,
            'status' => $translation?->status,
            'published_at' => $project->published_at?->toDateString(),
            'external' => $project->external,
            'problem' => $translation?->problem,
            'current_focus' => $translation?->current_focus,
            'metrics' => $translation?->metrics,
            'body' => $translation?->body,
            'technologies' => $project->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'show_history' => $project->show_history,
            'history' => null,
            'href' => $project->href,
            'related' => null,
            'updated_at' => $project->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function caseStudy(CaseStudy $case, string $locale): array
    {
        $translation = $case->translation($locale);

        return [
            'slug' => $case->slug,
            'url' => Locale::url("/cases/{$this->key($case)}", $locale),
            'title' => $translation?->title ?? $case->slug,
            'status' => $translation?->status,
            'summary' => $translation?->summary,
            'published_at' => $case->published_at?->toDateString(),
            'external' => $case->external,
            'meta' => $translation?->meta,
            'context' => $translation?->context,
            'role' => $translation?->role,
            'result' => $translation?->result,
            'metrics' => $translation?->metrics,
            'body' => $translation?->body,
            'technologies' => $case->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'show_history' => $case->show_history,
            'history' => null,
            'href' => $case->href,
            'related' => null,
            'updated_at' => $case->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function writing(Writing $writing, string $locale): array
    {
        $translation = $writing->translation($locale);

        return [
            'slug' => $writing->slug,
            'url' => Locale::url("/writing/{$this->key($writing)}", $locale),
            'title' => $translation?->title ?? $writing->slug,
            'excerpt' => $translation?->excerpt,
            'reading_time' => $translation?->reading_time,
            'body' => $translation?->body,
            'type' => $writing->type,
            'date' => $writing->date_iso?->toDateString(),
            'topics' => $writing->topics->map(fn ($topic) => [
                'slug' => $topic->slug,
                'name' => $topic->translation($locale)?->name ?? $topic->slug,
                'url' => Locale::url("/topics/{$this->key($topic)}", $locale),
            ])->values(),
            'show_history' => $writing->show_history,
            'history' => null,
            'related' => null,
            'updated_at' => $writing->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function collectionDetail(
        ReferenceCollection $collection,
        string $locale,
        ?LengthAwarePaginator $resources,
    ): array {
        $translation = $collection->translation($locale);

        return [
            'slug' => $collection->slug,
            'url' => Locale::url("/collections/{$this->key($collection)}", $locale),
            'title' => $translation?->title ?? $collection->slug,
            'description' => $translation?->description,
            'intro' => $translation?->intro,
            'published_at' => $collection->published_at?->toDateString(),
            'resources' => $resources?->getCollection()->map(function ($resource) use ($locale): array {
                $resourceTranslation = $resource->translation($locale);

                return [
                    'slug' => $resource->slug,
                    'url' => Locale::url("/findings/{$this->key($resource)}", $locale),
                    'title' => $resourceTranslation?->title ?? $resource->slug,
                    'description' => $resourceTranslation?->description,
                    'type' => $resource->type,
                    'rating' => $resource->rating,
                    'note' => $resource->pivot->note,
                    'topics' => $resource->topics->map(fn ($topic) => [
                        'slug' => $topic->slug,
                        'name' => $topic->translation($locale)?->name ?? $topic->slug,
                    ])->values(),
                ];
            })->values()->all() ?? [],
            'resources_meta' => $resources === null ? null : [
                'page' => $resources->currentPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
                'last_page' => $resources->lastPage(),
                'from' => $resources->firstItem(),
                'to' => $resources->lastItem(),
            ],
            'related' => null,
            'updated_at' => $collection->updated_at?->format('Y-m-d H:i:s'),
            'created_at' => $collection->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function experiment(Experiment $experiment, string $locale): array
    {
        $translation = $experiment->translation($locale);

        return [
            'slug' => $experiment->slug,
            'url' => Locale::url("/projects/experiments/{$this->key($experiment)}", $locale),
            'name' => $translation?->name ?? $experiment->slug,
            'purpose' => $translation?->purpose,
            'body' => $translation?->body,
            'published_at' => $experiment->published_at?->toDateString(),
            'external' => $experiment->external,
            'technologies' => $experiment->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'href' => $experiment->href,
            'updated_at' => $experiment->updated_at?->format('Y-m-d H:i:s'),
            'show_history' => $experiment->show_history,
            'history' => null,
            'related' => null,
        ];
    }

    private function snippet(Snippet $snippet, string $locale): array
    {
        $translation = $snippet->translation($locale);

        return [
            'slug' => $snippet->slug,
            'url' => Locale::url("/snippets/{$this->key($snippet)}", $locale),
            'download_url' => "/api/v1/snippets/{$snippet->slug}/download",
            'title' => $translation?->title ?? $snippet->slug,
            'description' => $translation?->description,
            'published_at' => $snippet->published_at?->toDateString(),
            'files' => $snippet->files->map(fn ($file) => [
                'path' => $file->path,
                'language' => $file->language,
                'content' => $file->content,
                'id' => (string) $file->id,
                'history' => null,
            ])->values(),
            'show_history' => $snippet->show_history,
            'history' => null,
            'related' => null,
            'updated_at' => $snippet->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    private function key(object $model): string
    {
        return $model->public_id ? "{$model->public_id}-{$model->slug}" : $model->slug;
    }
}
