<?php

namespace App\Http\Responses;

use App\Application\PublicSite\PublicFeedItem;
use App\Content\Locale;
use App\Models\CaseStudy;
use App\Models\CreditCategory;
use App\Models\Experiment;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Snippet;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\Writing;
use App\OpenGraph\OgImageUrlGenerator;
use App\Support\PublicMediaUrl;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

final class PublicContentResponseFactory
{
    /** @var Collection<string, CreditCategory>|null */
    private ?Collection $creditCategories = null;

    public function __construct(
        private readonly PublicFindingResponseFactory $findings,
        private readonly OgImageUrlGenerator $ogImages,
        private readonly PublicMediaUrl $media,
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
        return $this->withoutDetailFields($this->project($project, $locale, false));
    }

    private function caseStudySummary(CaseStudy $case, string $locale): array
    {
        return $this->withoutDetailFields($this->caseStudy($case, $locale, false));
    }

    private function writingSummary(Writing $writing, string $locale): array
    {
        return $this->withoutDetailFields($this->writing($writing, $locale, false));
    }

    private function experimentSummary(Experiment $experiment, string $locale): array
    {
        return $this->withoutDetailFields($this->experiment($experiment, $locale, false));
    }

    private function snippetSummary(Snippet $snippet, string $locale): array
    {
        $translation = $snippet->translation($locale);
        $slug = (string) $this->publishedValue($snippet, 'slug');

        return [
            'slug' => $slug,
            'title' => $translation?->title ?? $slug,
            'description' => $translation?->description,
            'og_image_url' => $this->ogImages->generate(
                'article',
                $translation?->title ?? $slug,
                $translation?->description,
            ),
            'url' => Locale::url('/snippets/'.$this->publicKey($snippet), $locale),
            'download_url' => Locale::url('/snippets/'.$this->publicKey($snippet).'/download', $locale),
            'files' => [],
            'file_count' => $snippet->files_count ?? 0,
            'updated_at' => $this->publishedDate($snippet, 'updated_at', true),
        ];
    }

    private function collectionSummary(ReferenceCollection $collection, string $locale): array
    {
        $translation = $collection->translation($locale);
        $slug = (string) $this->publishedValue($collection, 'slug');

        return [
            'slug' => $slug,
            'url' => Locale::url('/collections/'.$this->publicKey($collection), $locale),
            'title' => $translation?->title ?? $slug,
            'description' => $translation?->description,
            'og_image_url' => $this->ogImages->generate(
                'article',
                $translation?->title ?? $slug,
                $translation?->description,
            ),
            'intro' => $translation?->intro,
            'published_at' => $this->publishedDate($collection, 'published_at'),
            'resources_count' => $collection->resources_count ?? 0,
            'related' => null,
            'updated_at' => $this->publishedDate($collection, 'updated_at', true),
            'created_at' => $this->publishedDate($collection, 'created_at', true),
        ];
    }

    private function technology(Technology $technology, string $locale): array
    {
        $slug = (string) $this->publishedValue($technology, 'slug');
        $name = $technology->translation($locale)?->name ?? $slug;

        return [
            'slug' => $slug,
            'name' => $name,
            'code' => $this->publishedValue($technology, 'code') ?? '',
            'url' => Locale::url('/technologies/'.$this->publicKey($technology), $locale),
            'og_image_url' => $this->ogImages->generate(
                'article',
                $name,
            ),
            'skills' => $technology->resumeSkills
                ->map(fn ($skill) => $skill->topic?->translation($locale)?->name ?? $skill->topic?->slug)
                ->filter()
                ->values(),
            'resume_skills' => $technology->resumeSkills->map(fn ($skill) => $skill->topic ? [
                'slug' => $skill->topic->slug,
                'name' => $skill->topic->translation($locale)?->name ?? $skill->topic->slug,
                'url' => Locale::url('/topics/'.$this->publicKey($skill->topic), $locale),
                'parent' => $skill->topic->parent?->slug,
                'kind' => null,
                'children' => null,
            ] : null)->filter()->unique('slug')->values(),
        ];
    }

    private function topic(Topic $topic, string $locale): array
    {
        $slug = (string) $this->publishedValue($topic, 'slug');
        $name = $topic->translation($locale)?->name ?? $slug;

        return [
            'slug' => $slug,
            'url' => Locale::url('/topics/'.$this->publicKey($topic), $locale),
            'name' => $name,
            'og_image_url' => $this->ogImages->generate(
                'article',
                $name,
            ),
            'kind' => $this->publishedValue($topic, 'kind') === 'skill' ? 'topic' : $this->publishedValue($topic, 'kind'),
            'parent' => $topic->parent?->slug,
            'children' => $topic->children->map(fn ($child) => [
                'slug' => $child->slug,
                'name' => $child->translation($locale)?->name ?? $child->slug,
            ])->values(),
        ];
    }

    private function credit(object $credit, string $locale): array
    {
        $categoryKey = (string) $this->publishedValue($credit, 'category');
        $categoryName = $this->creditCategoryName($categoryKey, $locale);
        $name = $credit->translation($locale)?->name ?? $categoryName;

        return [
            'slug' => $this->publishedValue($credit, 'package_name') ?: $categoryKey.'-'.$credit->id,
            'category' => $categoryName,
            'name' => $name,
            'description' => $credit->translation($locale)?->description,
            'og_image_url' => $this->ogImages->generate(
                'article',
                $name,
                $credit->translation($locale)?->description,
            ),
            'url' => $this->publishedValue($credit, 'url'),
            'package_manager' => $this->publishedValue($credit, 'package_manager'),
            'package_name' => $this->publishedValue($credit, 'package_name'),
            'created_at' => $this->publishedDate($credit, 'created_at', true),
        ];
    }

    private function creditCategoryName(string $slug, string $locale): string
    {
        $this->creditCategories ??= CreditCategory::query()->with('translations')->get()->keyBy('slug');

        $category = $this->creditCategories->get($slug);
        if ($category === null) {
            return $slug;
        }

        $translation = $category->translation($locale);

        return $translation === null ? $slug : $translation->name;
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

    private function project(Project $project, string $locale, bool $includeSeo = true): array
    {
        $translation = $project->translation($locale);
        $seo = $includeSeo ? $this->translationSeo($translation) : null;
        $slug = (string) $this->publishedValue($project, 'slug');

        $data = [
            'slug' => $slug,
            'url' => Locale::url('/projects/'.$this->publicKey($project), $locale),
            'name' => $translation?->name ?? $slug,
            'purpose' => $translation?->purpose,
            'og_image_url' => $this->ogImageUrl(
                $seo,
                'project',
                $translation?->name ?? $slug,
                $translation?->purpose,
            ),
            'status' => $translation?->status,
            'published_at' => $this->publishedDate($project, 'published_at'),
            'external' => $this->publishedValue($project, 'external'),
            'problem' => $translation?->problem,
            'current_focus' => $translation?->current_focus,
            'metrics' => $translation?->metrics,
            'body' => $this->media->rewrite($translation?->body),
            'technologies' => $project->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'show_history' => $this->publishedValue($project, 'show_history'),
            'history' => null,
            'href' => $this->publishedValue($project, 'href'),
            'related' => null,
            'updated_at' => $this->publishedDate($project, 'updated_at', true),
        ];

        if ($seo !== null) {
            $data['seo'] = $seo;
        }

        return $data;
    }

    private function caseStudy(CaseStudy $case, string $locale, bool $includeSeo = true): array
    {
        $translation = $case->translation($locale);
        $seo = $includeSeo ? $this->translationSeo($translation) : null;
        $slug = (string) $this->publishedValue($case, 'slug');

        $data = [
            'slug' => $slug,
            'url' => Locale::url('/cases/'.$this->publicKey($case), $locale),
            'title' => $translation?->title ?? $slug,
            'status' => $translation?->status,
            'summary' => $translation?->summary,
            'og_image_url' => $this->ogImageUrl(
                $seo,
                'project',
                $translation?->title ?? $slug,
                $translation?->summary,
            ),
            'published_at' => $this->publishedDate($case, 'published_at'),
            'external' => $this->publishedValue($case, 'external'),
            'meta' => $translation?->meta,
            'context' => $translation?->context,
            'role' => $translation?->role,
            'result' => $translation?->result,
            'metrics' => $translation?->metrics,
            'body' => $this->media->rewrite($translation?->body),
            'technologies' => $case->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'show_history' => $this->publishedValue($case, 'show_history'),
            'history' => null,
            'href' => $this->publishedValue($case, 'href'),
            'related' => null,
            'updated_at' => $this->publishedDate($case, 'updated_at', true),
        ];

        if ($seo !== null) {
            $data['seo'] = $seo;
        }

        return $data;
    }

    private function writing(Writing $writing, string $locale, bool $includeSeo = true): array
    {
        $translation = $writing->translation($locale);
        $seo = $includeSeo ? $this->translationSeo($translation) : null;
        $slug = (string) $this->publishedValue($writing, 'slug');

        $data = [
            'slug' => $slug,
            'url' => Locale::url('/writing/'.$this->publicKey($writing), $locale),
            'title' => $translation?->title ?? $slug,
            'excerpt' => $translation?->excerpt,
            'og_image_url' => $this->ogImageUrl(
                $seo,
                'article',
                $translation?->title ?? $slug,
                $translation?->excerpt,
            ),
            'reading_time' => $translation?->reading_time,
            'body' => $this->media->rewrite($translation?->body),
            'type' => $this->publishedValue($writing, 'type'),
            'date' => $this->publishedDate($writing, 'date_iso'),
            'topics' => $writing->topics->map(fn ($topic) => [
                'slug' => $topic->slug,
                'name' => $topic->translation($locale)?->name ?? $topic->slug,
                'url' => Locale::url('/topics/'.$this->publicKey($topic), $locale),
            ])->values(),
            'show_history' => $this->publishedValue($writing, 'show_history'),
            'history' => null,
            'related' => null,
            'updated_at' => $this->publishedDate($writing, 'updated_at', true),
        ];

        if ($seo !== null) {
            $data['seo'] = $seo;
        }

        return $data;
    }

    private function collectionDetail(
        ReferenceCollection $collection,
        string $locale,
        ?LengthAwarePaginator $resources,
    ): array {
        $translation = $collection->translation($locale);
        $seo = $this->translationSeo($translation);
        $slug = (string) $this->publishedValue($collection, 'slug');

        $data = [
            'slug' => $slug,
            'url' => Locale::url('/collections/'.$this->publicKey($collection), $locale),
            'title' => $translation?->title ?? $slug,
            'description' => $translation?->description,
            'og_image_url' => $this->ogImageUrl(
                $seo,
                'article',
                $this->translationString($translation, 'title') ?? $slug,
                $this->translationString($translation, 'description'),
            ),
            'seo' => $seo,
            'intro' => $this->media->rewrite($translation?->intro),
            'published_at' => $this->publishedDate($collection, 'published_at'),
            'resources' => $resources?->getCollection()->map(function ($resource) use ($locale): array {
                $resourceTranslation = $resource->translation($locale);
                $resourceSlug = (string) $this->publishedValue($resource, 'slug');

                return [
                    'slug' => $resourceSlug,
                    'url' => Locale::url('/findings/'.$this->publicKey($resource), $locale),
                    'title' => $resourceTranslation?->title ?? $resourceSlug,
                    'description' => $resourceTranslation?->description,
                    'og_image_url' => $this->ogImages->generate(
                        'article',
                        $resourceTranslation?->title ?? $resourceSlug,
                        $resourceTranslation?->description,
                    ),
                    'type' => $this->publishedValue($resource, 'type'),
                    'rating' => $this->publishedValue($resource, 'rating'),
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
            'updated_at' => $this->publishedDate($collection, 'updated_at', true),
            'created_at' => $this->publishedDate($collection, 'created_at', true),
        ];

        return $data;
    }

    private function experiment(Experiment $experiment, string $locale, bool $includeSeo = true): array
    {
        $translation = $experiment->translation($locale);
        $seo = $includeSeo ? $this->translationSeo($translation) : null;
        $slug = (string) $this->publishedValue($experiment, 'slug');

        $data = [
            'slug' => $slug,
            'url' => Locale::url('/projects/experiments/'.$this->publicKey($experiment), $locale),
            'name' => $translation?->name ?? $slug,
            'purpose' => $translation?->purpose,
            'og_image_url' => $this->ogImageUrl(
                $seo,
                'project',
                $translation?->name ?? $slug,
                $translation?->purpose,
            ),
            'body' => $this->media->rewrite($translation?->body),
            'published_at' => $this->publishedDate($experiment, 'published_at'),
            'external' => $this->publishedValue($experiment, 'external'),
            'technologies' => $experiment->technologies->map(fn ($technology) => [
                'slug' => $technology->slug,
                'name' => $technology->translation($locale)?->name ?? $technology->slug,
            ])->values(),
            'href' => $this->publishedValue($experiment, 'href'),
            'updated_at' => $this->publishedDate($experiment, 'updated_at', true),
            'show_history' => $this->publishedValue($experiment, 'show_history'),
            'history' => null,
            'related' => null,
        ];

        if ($seo !== null) {
            $data['seo'] = $seo;
        }

        return $data;
    }

    private function snippet(Snippet $snippet, string $locale): array
    {
        $translation = $snippet->translation($locale);
        $seo = $this->translationSeo($translation);
        $slug = (string) $this->publishedValue($snippet, 'slug');

        return [
            'slug' => $slug,
            'url' => Locale::url('/snippets/'.$this->publicKey($snippet), $locale),
            'download_url' => '/api/v1/snippets/'.$this->publicKey($snippet).'/download',
            'title' => $translation?->title ?? $slug,
            'description' => $translation?->description,
            'og_image_url' => $this->ogImageUrl(
                $seo,
                'article',
                $translation?->title ?? $slug,
                $translation?->description,
            ),
            'seo' => $seo,
            'published_at' => $this->publishedDate($snippet, 'published_at'),
            'files' => $snippet->files->map(fn ($file) => [
                'path' => $file->path,
                'language' => $file->language,
                'content' => $file->content,
                'id' => (string) $file->id,
                'history' => null,
            ])->values(),
            'show_history' => $this->publishedValue($snippet, 'show_history'),
            'history' => null,
            'related' => null,
            'updated_at' => $this->publishedDate($snippet, 'updated_at', true),
        ];
    }

    private function translationSeo(?object $translation): ?array
    {
        $seo = $translation?->seo;
        $rewritten = $this->media->rewrite($seo);

        return is_array($rewritten) ? $rewritten : null;
    }

    private function publishedValue(Model $model, string $attribute): mixed
    {
        $revision = $model->relationLoaded('publishedRevision')
            ? $model->getRelation('publishedRevision')
            : $model->getRelationValue('publishedRevision');

        return $revision instanceof Model ? $revision->getAttribute($attribute) : null;
    }

    private function publishedDate(Model $model, string $attribute, bool $withTime = false): ?string
    {
        $value = $this->publishedValue($model, $attribute);
        if ($value === null) {
            return null;
        }

        if ($value instanceof CarbonInterface) {
            return $withTime ? $value->format('Y-m-d H:i:s') : $value->toDateString();
        }

        $date = date_create((string) $value);
        if ($date === false) {
            return null;
        }

        return $withTime ? $date->format('Y-m-d H:i:s') : $date->format('Y-m-d');
    }

    private function publicKey(Model $model): string
    {
        $slug = (string) $this->publishedValue($model, 'slug');
        $publicId = $this->publishedValue($model, 'public_id');

        return is_string($publicId) && $publicId !== '' ? $publicId.'-'.$slug : $slug;
    }

    private function ogImageUrl(
        ?array $seo,
        string $template,
        string $title,
        ?string $description = null,
    ): ?string {
        $image = $seo['image'] ?? null;

        return is_string($image) && trim($image) !== ''
            ? $image
            : $this->ogImages->generate($template, $title, $description);
    }

    private function translationString(?object $translation, string $attribute): ?string
    {
        if (! $translation instanceof Model) {
            return null;
        }

        $value = $translation->getAttribute($attribute);

        return is_string($value) ? $value : null;
    }
}
