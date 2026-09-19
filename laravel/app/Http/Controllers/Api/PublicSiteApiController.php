<?php

namespace App\Http\Controllers\Api;

use App\Content\CaseStudyQuery;
use App\Content\CreditsQuery;
use App\Content\KnowledgeGraphQuery;
use App\Content\Locale;
use App\Content\NavQuery;
use App\Content\PageQuery;
use App\Content\ProjectQuery;
use App\Content\ReferenceCollectionQuery;
use App\Content\ResourceApiTransformer;
use App\Content\ResourceQuery;
use App\Content\ResumeQuery;
use App\Content\SiteChromeQuery;
use App\Content\SiteSettingsQuery;
use App\Content\WritingQuery;
use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use App\Models\Experiment;
use App\Models\Page;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Resource;
use App\Models\Snippet;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Read-only content contract for the gradual Blazor migration.
 *
 * The endpoint intentionally returns public presentation data only. Laravel
 * remains responsible for querying the database and the admin continues to
 * edit the same records; Blazor consumes this contract during the transition.
 */
class PublicSiteApiController extends Controller
{
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

    public function protectedEmailChallenge(Request $request): JsonResponse|Response
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return response()->json(['error' => 'maintenance'], 503)->header('Retry-After', (string) 3600);
        }

        return response()->json((new SiteChromeQuery)->build(
            Locale::normalize($request->query('locale'))
        )['emailChallenge']);
    }

    public function knowledgeMap(Request $request): JsonResponse
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return response()->json(['error' => 'maintenance'], 503)->header('Retry-After', (string) 3600);
        }

        return response()->json((new KnowledgeGraphQuery)->build(Locale::normalize($request->query('locale'))))
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }

    public function index(Request $request): JsonResponse|Response
    {
        if ((new SiteSettingsQuery)->find()?->maintenance_enabled) {
            return response()->json(['error' => 'maintenance'], 503)->header('Retry-After', (string) 3600);
        }

        $locale = Locale::normalize($request->query('locale'));
        $chrome = (new SiteChromeQuery)->build($locale);
        $settings = $chrome['siteSettings'];
        $profile = $chrome['headerProfile'];
        $profileTranslation = $profile?->translation($locale);
        $projects = (new ProjectQuery)->list()->map(fn ($project) => $this->project($project, $locale))->values();
        $cases = (new CaseStudyQuery)->list()->map(fn ($case) => $this->caseStudy($case, $locale))->values();
        $writings = (new WritingQuery)->list()->map(fn ($writing) => $this->writing($writing, $locale))->values();
        $findings = (new ResourceQuery)->list([], $locale)->map(
            fn ($resource) => $this->finding($resource, $locale)
        )->values();

        $revision = DB::table('content_revisions')->value('version') ?? 0;
        $body = Cache::rememberForever("public-site-snapshot:{$revision}:{$locale}", fn () => response()->json([
            'schema_version' => 2,
            'locale' => $locale,
            'generated_at' => now()->toIso8601String(),
            'chrome' => [
                'site' => [
                    'short_name' => $settings?->short_name,
                    'portfolio_url' => $settings?->portfolio_url ?? '',
                    'source_repository_url' => $settings?->source_repository_url ?? '',
                    'contact_available' => $settings?->contact_available ?? false,
                    'contact_profiles' => $settings?->contactProfiles->map(fn ($profile) => [
                        'platform' => $profile->platform,
                        'label' => $profile->label ?: $profile->platform,
                        'url' => $profile->url,
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
                'visibility' => [
                    'about' => $profile !== null,
                    'resume' => $this->hasResume($locale, $profile),
                    'portfolio' => $this->featured($projects, 'projects', $locale)->isNotEmpty()
                        || $this->featured($cases, 'cases', $locale)->isNotEmpty()
                        || Experiment::where('hidden', false)->exists(),
                    'cases' => $cases->isNotEmpty(),
                    'contact' => (bool) ($settings?->contact_available),
                    'license' => $this->pageHasAny($locale, 'license', ['code_body', 'content_body', 'ai_body']),
                    'credits' => (new CreditsQuery)->list()->isNotEmpty(),
                    'follow' => $this->pageHasAny($locale, 'follow', ['rss_title', 'atom_title', 'jsonfeed_title', 'api_title', 'sitemap_title', 'robots_title', 'webfinger_title', 'activitypub_title', 'websub_title', 'webmention_title']),
                    'feed' => $writings->isNotEmpty(),
                    'writing' => $writings->isNotEmpty(),
                    'findings' => $findings->isNotEmpty(),
                    'topics' => Topic::where('hidden', false)->exists(),
                    'collections' => (new ReferenceCollectionQuery)->list()->isNotEmpty(),
                    'snippets' => Snippet::where('hidden', false)->exists(),
                    'right_sidebar' => (bool) ($settings?->contact_available),
                ],
            ],
            'pages' => $this->pages($locale),
            'credits' => (new CreditsQuery)->list()->map(fn ($credit) => [
                'category' => $credit->category,
                'name' => $credit->translation($locale)?->name ?? $credit->category,
                'description' => $credit->translation($locale)?->description,
                'url' => $credit->url,
                'created_at' => $credit->created_at?->format('Y-m-d H:i:s'),
            ])->values(),
            'resume' => $this->resume($locale, $profile),
            'projects' => $projects,
            'cases' => $cases,
            'writings' => $writings,
            'findings' => $findings,
            'collections' => (new ReferenceCollectionQuery)->list()->map(
                fn ($collection) => $this->collection($collection, $locale)
            )->values(),
            'topics' => Topic::where('hidden', false)->with(['translations', 'children.translations'])
                ->orderBy('order')->orderBy('id')->get()->map(fn ($topic) => [
                    'slug' => $topic->slug,
                    'name' => $topic->translation($locale)?->name ?? $topic->slug,
                    'url' => Locale::url("/topics/{$this->key($topic)}", $locale),
                    'parent' => $topic->parent?->slug,
                    'kind' => $topic->kind,
                    'children' => $topic->children->where('hidden', false)->map(fn ($child) => [
                        'slug' => $child->slug,
                        'name' => $child->translation($locale)?->name ?? $child->slug,
                        'url' => Locale::url("/topics/{$this->key($child)}", $locale),
                    ])->values(),
                ])->values(),
            'technologies' => Technology::where('hidden', false)->with(['translations', 'resumeSkills.topic.translations'])
                ->orderBy('order')
                ->get()
                ->map(fn ($technology) => [
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
                ])->values(),
            'experiments' => Experiment::where('hidden', false)
                ->orderBy('order')
                ->with(['translations', 'technologies.translations'])
                ->get()
                ->map(fn ($experiment) => $this->experiment($experiment, $locale))
                ->values(),
            'snippets' => Snippet::where('hidden', false)
                ->orderBy('order')
                ->with(['translations', 'files'])
                ->get()
                ->map(fn ($snippet) => $this->snippet($snippet, $locale))
                ->values(),
            'featured_cases' => $this->featured($cases, 'cases', $locale),
            'featured_projects' => $this->featured($projects, 'projects', $locale),
            'featured_writings' => $this->featured($writings, 'writings', $locale),
            'featured_findings' => $findings->where('featured', true)->sortBy([
                ['featured_order', 'asc'],
                ['popularity.rank', 'desc'],
                ['published_date', 'desc'],
            ])->values(),
            'resume_pdf_locales' => collect(['en', 'pt-BR'])->filter(function (string $value): bool {
                $roots = [
                    (string) env('PORTFOLIO_RESUME_PDF_ROOT', '/data/resume-cache'),
                    (string) env('PORTFOLIO_PUBLIC_ASSET_ROOT', '/data/public'),
                    storage_path('app/public'),
                ];

                return collect($roots)->contains(
                    fn (string $root) => file_exists("{$root}/resume-{$value}.pdf")
                );
            })->values(),
        ])->getContent());
        $etag = '"'.substr(hash('sha256', $body), 0, 32).'"';

        if ($request->header('If-None-Match') === $etag) {
            return response(null, 304)->header('ETag', $etag);
        }

        return response($body, 200, ['Content-Type' => 'application/json; charset=utf-8'])
            ->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
            ->header('ETag', $etag);
    }

    private function pages(string $locale): array
    {
        return Page::with('translations')->orderBy('id')->get()->mapWithKeys(function (Page $page) use ($locale): array {
            $fields = $page?->translation($locale)?->fields ?? [];
            if ($page?->updated_at) {
                $fields['updated_at'] = $page->updated_at->format('Y-m-d H:i:s');
            }

            return [$page->slug => $fields];
        })
            ->all();
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

    private function collection(ReferenceCollection $collection, string $locale): array
    {
        $translation = $collection->translation($locale);
        $details = (new ReferenceCollectionQuery)->findBySlug($collection->slug);

        return [
            'slug' => $collection->slug,
            'url' => Locale::url("/collections/{$this->key($collection)}", $locale),
            'title' => $translation?->title ?? $collection->slug,
            'description' => $translation?->description,
            'intro' => $translation?->intro,
            'published_at' => $collection->published_at?->toDateString(),
            'resources' => $details?->resources->map(function ($resource) use ($locale) {
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
            })->values() ?? collect(),
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
        return (new ResourceApiTransformer)->toArray($resource, $locale);
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

    private function featured($items, string $kind, string $locale)
    {
        $relation = match ($kind) {
            'cases' => 'featuredCases',
            'projects' => 'featuredProjects',
            'writings' => 'featuredWritings',
        };

        $page = Page::where('slug', 'portfolio')->with($relation)->first();
        $slugs = $page?->{$relation}
            ->sortBy(fn ($item) => [$item->pivot->order === null ? 0 : 1, $item->pivot->order, $item->id])
            ->take(3)
            ->pluck('slug') ?? collect();

        return $slugs->map(fn (string $slug) => $items->firstWhere('slug', $slug))
            ->filter()
            ->values();
    }
}
