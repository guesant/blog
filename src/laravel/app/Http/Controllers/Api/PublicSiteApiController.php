<?php

namespace App\Http\Controllers\Api;

use App\Content\CaseStudyQuery;
use App\Content\CreditsQuery;
use App\Content\InterfaceQuery;
use App\Content\KnowledgeGraphQuery;
use App\Content\Locale;
use App\Content\NavQuery;
use App\Content\PageQuery;
use App\Content\ProjectQuery;
use App\Content\ReferenceCollectionQuery;
use App\Content\ResourceApiTransformer;
use App\Content\ResumeQuery;
use App\Content\SiteChromeQuery;
use App\Content\SiteSettingsQuery;
use App\Content\SnippetQuery;
use App\Content\TechnologyQuery;
use App\Content\TopicQuery;
use App\Content\WritingQuery;
use App\Http\Controllers\Controller;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\Models\CaseStudy;
use App\Models\CreditEntry;
use App\Models\Experiment;
use App\Models\Page;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Resource;
use App\Models\Snippet;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\Writing;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

/**
 * Read-only content contract for the public frontend.
 *
 * The endpoint intentionally returns public presentation data only. Laravel
 * remains responsible for querying the database and the admin continues to
 * edit the same records; the public frontend consumes this contract.
 */
class PublicSiteApiController extends Controller
{
    private const COLLECTIONS = [
        'cases',
        'collections',
        'credits',
        'experiments',
        'projects',
        'snippets',
        'technologies',
        'topics',
        'writing',
    ];

    /** @response array{data: list<array<string, mixed>>, meta: array<string, mixed>} */
    #[ScrambleResponse(404, 'The requested collection was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function collection(Request $request, string $collection): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        abort_unless(in_array($collection, self::COLLECTIONS, true), 404);

        $locale = Locale::normalize($request->query('locale'));
        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $sort = $this->sort($request->query('sort'));
        $items = $request->boolean('featured')
            ? $this->featuredCollection($collection, $perPage, $request->integer('page', 1))
            : $this->paginateCollection($collection, $perPage, $sort);

        $data = $items->getCollection()
            ->map(fn ($item) => $this->presentCollectionItem($collection, $item, $locale))
            ->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'page' => $items->currentPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
                'last_page' => $items->lastPage(),
                'from' => $items->firstItem(),
                'to' => $items->lastItem(),
                'locale' => $locale,
            ],
        ])->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    /** @response array<string, mixed> */
    #[ScrambleResponse(404, 'The requested document was not found.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function document(Request $request, string $collection, string $slug): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        abort_unless(in_array($collection, self::COLLECTIONS, true), 404);

        $locale = Locale::normalize($request->query('locale'));
        $perPage = min(max((int) $request->query('per_page', 100), 1), 100);
        $page = max(1, $request->integer('page', 1));
        $item = $this->findCollectionItem($collection, $slug, $locale, $perPage, $page);

        abort_unless($item !== null, 404);

        return response()->json($item)->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    public function resumePdf(string $locale): Response
    {
        if (! in_array($locale, ['en', 'pt-BR'], true)) {
            abort(404);
        }

        $path = storage_path("app/public/resume-{$locale}.pdf");
        if (! is_file($path)) {
            abort(404);
        }

        return response()->file($path, [
            'Cache-Control' => 'public, max-age=3600',
            'Content-Type' => 'application/pdf',
        ]);
    }

    /** @response array<string, mixed>|null */
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function protectedEmailChallenge(Request $request): JsonResponse|Response
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        return response()->json((new SiteChromeQuery)->build(
            Locale::normalize($request->query('locale'))
        )['emailChallenge']);
    }

    /** @response array{nodes: list<array<string, mixed>>, edges: list<array<string, mixed>>, kinds: array<string, mixed>} */
    #[ScrambleResponse(503, 'The service is temporarily unavailable.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function knowledgeMap(Request $request): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        $graph = (new KnowledgeGraphQuery)->cached(Locale::normalize($request->query('locale')));

        if ($graph === []) {
            return response()->json([
                'nodes' => [],
                'edges' => [],
                'kinds' => [],
                'meta' => ['available' => false],
            ]);
        }

        return response()->json($graph)
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    public function chrome(Request $request): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return ApiErrorResponse::make(
                ApiErrorCode::Maintenance,
                503,
                'The service is temporarily unavailable.',
            )->header('Retry-After', (string) 3600);
        }

        return response()->json($this->chromeData(Locale::normalize($request->query('locale'))))
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    public function interfaceMessages(Request $request): JsonResponse
    {
        return response()->json((new InterfaceQuery)->forLocale(
            Locale::normalize($request->query('locale')),
        ))->header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    }

    public function page(Request $request, string $slug): JsonResponse
    {
        $page = (new PageQuery)->findBySlug($slug);
        abort_unless($page !== null, 404);

        return response()->json($this->pageFields($page, Locale::normalize($request->query('locale'))))
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    public function resumeData(Request $request): JsonResponse
    {
        $locale = Locale::normalize($request->query('locale'));
        $profile = (new ProfileQuery)->find();

        return response()->json($this->resume($locale, $profile))
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    private function pageFields(Page $page, string $locale): array
    {
        $fields = $page->translation($locale)?->fields ?? [];
        if ($page->updated_at) {
            $fields['updated_at'] = $page->updated_at->format('Y-m-d H:i:s');
        }

        if ($page->slug === 'now') {
            $fields['entries'] = collect([
                ['key' => 'trabalhando', 'label' => __('now.working', [], $locale)],
                ['key' => 'construindo', 'label' => __('now.building', [], $locale)],
                ['key' => 'estudando', 'label' => __('now.studying', [], $locale)],
                ['key' => 'lendo', 'label' => __('now.reading', [], $locale)],
                ['key' => 'ouvindo', 'label' => __('now.listening', [], $locale)],
                ['key' => 'assistindo', 'label' => __('now.watching', [], $locale)],
            ])->map(fn (array $entry) => [
                ...$entry,
                'value' => $fields[$entry['key']] ?? $fields[str_replace(
                    ['trabalhando', 'construindo', 'estudando', 'lendo', 'ouvindo', 'assistindo'],
                    ['working', 'building', 'studying', 'reading', 'listening', 'watching'],
                    $entry['key'],
                )] ?? null,
            ])->filter(fn (array $entry): bool => filled($entry['value']))->values()->all();
        }

        if ($page->slug === 'follow') {
            $available = [
                ['key' => 'rss', 'url' => Locale::path('/feed.xml', $locale)],
                ['key' => 'atom', 'url' => Locale::path('/atom.xml', $locale)],
                ['key' => 'jsonfeed', 'url' => Locale::path('/feed.json', $locale)],
                ['key' => 'api', 'url' => '/api/v1/findings'],
                ['key' => 'sitemap', 'url' => Locale::path('/sitemap.xml', $locale)],
                ['key' => 'robots', 'url' => Locale::path('/robots.txt', $locale)],
                ['key' => 'webfinger'],
            ];
            $future = [['key' => 'activitypub'], ['key' => 'websub'], ['key' => 'webmention']];
            $buildEntry = fn (array $entry): array => [
                ...$entry,
                'title' => $fields["{$entry['key']}_title"] ?? null,
                'description' => $fields["{$entry['key']}_description"] ?? null,
            ];
            $fields['entries'] = collect($available)->map($buildEntry)->filter(
                fn (array $entry): bool => filled($entry['title']),
            )->values()->all();
            $fields['future_entries'] = collect($future)->map($buildEntry)->filter(
                fn (array $entry): bool => filled($entry['title']),
            )->values()->all();
        }

        return $fields;
    }

    private function chromeData(string $locale): array
    {
        $chrome = (new SiteChromeQuery)->build($locale);
        $settings = $chrome['siteSettings'];
        $profile = $chrome['headerProfile'];
        $profileTranslation = $profile?->translation($locale);

        return [
            'site' => [
                'short_name' => $settings?->short_name,
                'portfolio_url' => $settings?->portfolio_url ?? '',
                'source_repository_url' => $settings?->source_repository_url ?? '',
                'contact_available' => $settings?->contact_available ?? false,
                'contact_profiles' => $settings?->contactProfiles->map(fn ($contactProfile) => [
                    'platform' => $contactProfile->platform,
                    'label' => $contactProfile->label ?: $contactProfile->platform,
                    'url' => $contactProfile->url,
                ])->values(),
                'protected_email' => null,
                'maintenance_enabled' => $settings?->maintenance_enabled ?? false,
                'maintenance_eyebrow' => $settings?->translation($locale)?->maintenance_eyebrow,
                'maintenance_title' => $settings?->translation($locale)?->maintenance_title,
                'maintenance_description' => $settings?->translation($locale)?->maintenance_description,
                'seo' => $settings?->translation($locale)?->seo,
            ],
            'profile' => $profile ? [
                'name' => $profile->name,
                'title' => $profileTranslation?->title,
                'location' => $profileTranslation?->location,
                'description' => $profileTranslation?->description,
                'milestones' => $profileTranslation?->milestones,
                'birth_date' => $profile->birth_date?->toDateString() ?? '',
                'birth_city' => $profileTranslation?->birth_city,
                'interests' => $profileTranslation?->interests,
                'learning' => $profileTranslation?->learning,
                'personal_interests' => $profileTranslation?->personal_interests,
            ] : null,
            'copyright' => $chrome['copyright'],
            'navigation' => [
                'sidebar' => (new NavQuery)->sidebarGroups($locale),
                'footer_links' => (new NavQuery)->footerLinkItems($locale),
                'sitemap' => (new NavQuery)->siteMapTree($locale),
            ],
            'build' => [
                'commit_sha' => $chrome['commitSha'],
                'build_time' => $chrome['buildTime'],
            ],
            'visibility' => $this->visibility($locale, $profile, $settings),
        ];
    }

    private function visibility(string $locale, $profile, $settings): array
    {
        return [
            'about' => $profile !== null,
            'resume' => $this->hasResume($locale, $profile),
            'portfolio' => Project::where('hidden', false)->where('nda', false)->exists()
                || CaseStudy::where('hidden', false)->where('nda', false)->exists()
                || Experiment::where('hidden', false)->exists(),
            'cases' => CaseStudy::where('hidden', false)->where('nda', false)->exists(),
            'contact' => (bool) ($settings?->contact_available),
            'license' => $this->pageHasAny($locale, 'license', ['code_body', 'content_body', 'ai_body']),
            'credits' => CreditEntry::where('active', true)->exists(),
            'follow' => $this->pageHasAny($locale, 'follow', ['rss_title', 'atom_title', 'jsonfeed_title', 'api_title', 'sitemap_title', 'robots_title', 'webfinger_title', 'activitypub_title', 'websub_title', 'webmention_title']),
            'feed' => Writing::where('hidden', false)->exists(),
            'writing' => Writing::where('hidden', false)->exists(),
            'findings' => Resource::public()->exists(),
            'topics' => Topic::where('hidden', false)->exists(),
            'collections' => ReferenceCollection::where('hidden', false)->exists(),
            'snippets' => Snippet::where('hidden', false)->exists(),
            'right_sidebar' => (bool) ($settings?->contact_available),
        ];
    }

    private function paginateCollection(string $collection, int $perPage, ?string $sort): LengthAwarePaginator
    {
        return match ($collection) {
            'cases' => (new CaseStudyQuery)->listPaginated($perPage, $sort),
            'collections' => (new ReferenceCollectionQuery)->listPaginated($perPage, $sort),
            'credits' => (new CreditsQuery)->listPaginated($perPage, $sort),
            'experiments' => (new ProjectQuery)->listExperimentsPaginated($perPage, $sort),
            'projects' => (new ProjectQuery)->listPaginated($perPage, $sort),
            'snippets' => (new SnippetQuery)->listPaginated($perPage, $sort),
            'technologies' => (new TechnologyQuery)->listPaginated($perPage, $sort),
            'topics' => (new TopicQuery)->listPaginated($perPage, $sort),
            'writing' => (new WritingQuery)->listPaginated($perPage, $sort),
        };
    }

    private function featuredCollection(string $collection, int $perPage, int $page): LengthAwarePaginator
    {
        $configuration = match ($collection) {
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
            default => abort(404),
        };
        $portfolio = Page::where('slug', 'portfolio')->with('currentRevision')->first()?->currentRevision;

        if ($portfolio === null) {
            return new LengthAwarePaginator([], 0, $perPage, max(1, $page));
        }

        $query = $portfolio->{$configuration['relation']}()
            ->where('hidden', false)
            ->with($configuration['with'])
            ->when($collection === 'cases', fn ($builder) => $builder->where('nda', false));
        $pivot = $configuration['pivot'];

        return $query
            ->orderByRaw("CASE WHEN {$pivot}.sort_order IS NULL THEN 0 ELSE 1 END")
            ->orderBy("{$pivot}.sort_order")
            ->orderBy("{$configuration['table']}.id")
            ->paginate($perPage, ['*'], 'page', max(1, $page));
    }

    private function presentCollectionItem(string $collection, object $item, string $locale): array
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

    private function findCollectionItem(string $collection, string $slug, string $locale, int $perPage = 20, int $page = 1): ?array
    {
        $item = match ($collection) {
            'cases' => (new CaseStudyQuery)->findBySlug($slug),
            'collections' => (new ReferenceCollectionQuery)->findBySlug($slug),
            'experiments' => (new ProjectQuery)->findExperimentBySlug($slug),
            'projects' => (new ProjectQuery)->findBySlug($slug),
            'snippets' => (new SnippetQuery)->findBySlug($slug),
            'technologies' => (new TechnologyQuery)->findBySlug($slug),
            'topics' => (new TopicQuery)->findBySlug($slug),
            'writing' => (new WritingQuery)->findBySlug($slug),
            default => null,
        };

        if ($item === null) {
            return null;
        }

        return match ($collection) {
            'cases' => $this->caseStudy($item, $locale),
            'collections' => $this->collectionDetail($item, $locale, $perPage, $page),
            'experiments' => $this->experiment($item, $locale),
            'projects' => $this->project($item, $locale),
            'snippets' => $this->snippet($item, $locale),
            'technologies' => $this->technology($item, $locale),
            'topics' => $this->topic($item, $locale),
            'writing' => $this->writing($item, $locale),
        };
    }

    private function sort(mixed $value): ?string
    {
        return in_array($value, ['asc', 'desc', 'alpha', 'popular'], true) ? $value : null;
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

    private function collectionDetail(ReferenceCollection $collection, string $locale, int $perPage, int $page): array
    {
        $translation = $collection->translation($locale);
        $resources = (new ReferenceCollectionQuery)->resourcesPaginated($collection, $perPage, $page);

        return [
            'slug' => $collection->slug,
            'url' => Locale::url("/collections/{$this->key($collection)}", $locale),
            'title' => $translation?->title ?? $collection->slug,
            'description' => $translation?->description,
            'intro' => $translation?->intro,
            'published_at' => $collection->published_at?->toDateString(),
            'resources' => $resources->getCollection()->map(function ($resource) use ($locale) {
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
            })->values(),
            'resources_meta' => [
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

    private function resume(string $locale, $profile): array
    {
        $resume = (new ResumeQuery)->find();
        $translation = $resume?->translation($locale);
        $profileTranslation = $profile?->translation($locale);

        return [
            'summary' => $translation?->summary,
            'leadership' => $translation?->leadership ?? [],
            'education' => $translation?->education ?? [],
            'certificates' => $translation?->certificates ?? [],
            'certifications' => $translation?->certifications ?? [],
            'publications' => $translation?->publications ?? [],
            'recommendations' => $translation?->recommendations ?? [],
            'technical_productions' => $translation?->technical_productions ?? [],
            'events' => $translation?->events ?? [],
            'awards' => $translation?->awards ?? [],
            'experience' => collect($profileTranslation?->trajectory ?? [])
                ->filter(fn ($item) => ! ($item['hidden'] ?? false) && ($item['includeInResume'] ?? false))
                ->values(),
            'selected_cases' => $resume?->selectedCases
                ->sortBy('pivot.order')
                ->map(fn ($case) => $this->caseStudy($case, $locale))
                ->values() ?? collect(),
            'skills' => $resume?->skills
                ->sortBy('order')
                ->map(fn ($skill) => [
                    'name' => $skill->topic?->translation($locale)?->name ?? $skill->topic?->slug,
                    'technologies' => $skill->technologies->map(fn ($technology) => [
                        'slug' => $technology->slug,
                        'name' => $technology->translation($locale)?->name ?? $technology->slug,
                        'code' => null,
                        'url' => null,
                        'skills' => null,
                        'resume_skills' => null,
                    ])->values(),
                ])->values() ?? collect(),
            'languages' => $resume?->languages
                ->sortBy('order')
                ->map(fn ($language) => [
                    'name' => $language->language?->translation($locale)?->name ?? $language->language?->slug,
                    'proficiency' => $language->proficiency ?? '',
                ])->values() ?? collect(),
        ];
    }

    private function finding(Resource $resource, string $locale): array
    {
        return app(ResourceApiTransformer::class)->toArray($resource, $locale);
    }

    private function key(object $model): string
    {
        return $model->public_id ? "{$model->public_id}-{$model->slug}" : $model->slug;
    }

    private function pageHasAny(string $locale, string $slug, array $fields): bool
    {
        $values = (new PageQuery)->findBySlug($slug)?->translation($locale)?->fields ?? [];

        foreach ($fields as $field) {
            if (! empty($values[$field])) {
                return true;
            }
        }

        return false;
    }

    private function hasResume(string $locale, $profile): bool
    {
        $resume = (new ResumeQuery)->find();

        return $resume?->translation($locale)?->summary !== null
            || ! empty($profile?->translation($locale)?->trajectory);
    }
}
