<?php

namespace App\ReadModel\PublicSite\Chrome;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

final class PublicSiteAvailabilityReader
{
    public function read(string $locale, bool $hasProfile, bool $contactEnabled): array
    {
        $result = DB::query()
            ->selectSub($this->resumeWithContent($locale), 'has_resume_content')
            ->selectSub($this->profileWithTrajectory($locale), 'has_profile_trajectory')
            ->selectSub($this->publicContent('projects', ['hidden' => false, 'nda' => false]), 'has_projects')
            ->selectSub($this->publicContent('case_studies', ['hidden' => false, 'nda' => false]), 'has_cases')
            ->selectSub($this->publicContent('experiments', ['hidden' => false]), 'has_experiments')
            ->selectSub($this->pageWithFields('license', $locale, ['code_body', 'content_body', 'ai_body']), 'has_license')
            ->selectSub($this->publicCredits(), 'has_credits')
            ->selectSub($this->pageWithFields('follow', $locale, [
                'rss_title',
                'atom_title',
                'jsonfeed_title',
                'api_title',
                'sitemap_title',
                'robots_title',
                'webfinger_title',
                'activitypub_title',
                'websub_title',
                'webmention_title',
            ]), 'has_follow')
            ->selectSub($this->publicContent('writings', ['hidden' => false]), 'has_writing')
            ->selectSub($this->publicContent('resources', ['hidden' => false, 'visibility' => 'public']), 'has_findings')
            ->selectSub($this->publicContent('topics', ['hidden' => false]), 'has_topics')
            ->selectSub($this->publicContent('reference_collections', ['hidden' => false]), 'has_collections')
            ->selectSub($this->publicContent('snippets', ['hidden' => false]), 'has_snippets')
            ->first();

        $hasCases = $this->boolean($result?->has_cases);
        $hasPortfolio = $hasCases
            || $this->boolean($result?->has_projects)
            || $this->boolean($result?->has_experiments);
        $hasWriting = $this->boolean($result?->has_writing);

        return [
            'about' => $hasProfile,
            'resume' => $this->boolean($result?->has_resume_content)
                || $this->boolean($result?->has_profile_trajectory),
            'portfolio' => $hasPortfolio,
            'cases' => $hasCases,
            'contact' => $contactEnabled,
            'license' => $this->boolean($result?->has_license),
            'credits' => $this->boolean($result?->has_credits),
            'follow' => $this->boolean($result?->has_follow),
            'feed' => $hasWriting,
            'writing' => $hasWriting,
            'findings' => $this->boolean($result?->has_findings),
            'topics' => $this->boolean($result?->has_topics),
            'collections' => $this->boolean($result?->has_collections),
            'snippets' => $this->boolean($result?->has_snippets),
            'right_sidebar' => $contactEnabled,
        ];
    }

    private function resumeWithContent(string $locale): Builder
    {
        return DB::table('resumes as r')
            ->selectRaw('1')
            ->whereNotNull('r.published_revision_id')
            ->whereExists(function (Builder $query): void {
                $query->selectRaw('1')
                    ->from('resume_revisions as rr')
                    ->whereColumn('rr.id', 'r.published_revision_id')
                    ->where(fn ($visibility) => $visibility
                        ->where('rr.hidden', false)
                        ->orWhereNull('rr.hidden'));
            })
            ->whereExists(function (Builder $query) use ($locale): void {
                $query->selectRaw('1')
                    ->from('resume_revision_translations as rt')
                    ->whereColumn('rt.resume_revision_id', 'r.published_revision_id')
                    ->where(function (Builder $query) use ($locale): void {
                        $query->where(function (Builder $query) use ($locale): void {
                            $query->where('rt.locale', $locale)
                                ->where(function (Builder $content): void {
                                    $this->resumeTranslationHasContent($content);
                                });
                        })->orWhere(function (Builder $query) use ($locale): void {
                            $query->where('rt.locale', 'en')
                                ->whereNotExists(function (Builder $query) use ($locale): void {
                                    $query->selectRaw('1')
                                        ->from('resume_revision_translations as rt_locale')
                                        ->whereColumn('rt_locale.resume_revision_id', 'r.published_revision_id')
                                        ->where('rt_locale.locale', $locale);
                                })->where(function (Builder $content): void {
                                    $this->resumeTranslationHasContent($content);
                                });
                        });
                    });
            })
            ->limit(1);
    }

    private function resumeTranslationHasContent(Builder $query): void
    {
        $query
            ->where(function (Builder $content): void {
                $content
                    ->where(function (Builder $summary): void {
                        $summary
                            ->whereNotNull('rt.summary')
                            ->where('rt.summary', '<>', '');
                    });

                foreach ([
                    'leadership',
                    'education',
                    'certificates',
                    'certifications',
                    'publications',
                    'recommendations',
                    'technical_productions',
                    'events',
                    'awards',
                ] as $section) {
                    $content->orWhereExists(function (Builder $rows) use ($section): void {
                        $rows
                            ->selectRaw('1')
                            ->from('resume_revision_'.$section)
                            ->whereColumn('resume_revision_'.$section.'.resume_revision_translation_id', 'rt.id');
                    });
                }

                foreach (['selected_cases', 'skills', 'skill_technologies', 'languages'] as $relation) {
                    $content->orWhereExists(function (Builder $rows) use ($relation): void {
                        $rows
                            ->selectRaw('1')
                            ->from($relation === 'skill_technologies'
                                ? 'resume_revision_skill_technologies'
                                : 'resume_revision_'.$relation)
                            ->whereColumn(
                                $relation === 'skill_technologies'
                                    ? 'resume_revision_skill_technologies.resume_revision_id'
                                    : 'resume_revision_'.$relation.'.resume_revision_id',
                                'r.published_revision_id',
                            );
                    });
                }
            });
    }

    private function profileWithTrajectory(string $locale): Builder
    {
        return DB::table('profiles as p')
            ->selectRaw('1')
            ->whereNotNull('p.published_revision_id')
            ->whereExists(function (Builder $query): void {
                $query->selectRaw('1')
                    ->from('profile_revisions as pr')
                    ->whereColumn('pr.id', 'p.published_revision_id')
                    ->where(fn ($visibility) => $visibility
                        ->where('pr.hidden', false)
                        ->orWhereNull('pr.hidden'));
            })
            ->whereExists(function (Builder $query) use ($locale): void {
                $query->selectRaw('1')
                    ->from('profile_revision_translations as pt')
                    ->whereColumn('pt.profile_revision_id', 'p.published_revision_id')
                    ->where(function (Builder $query) use ($locale): void {
                        $query->where('pt.locale', $locale)
                            ->orWhere(function (Builder $query) use ($locale): void {
                                $query->where('pt.locale', 'en')
                                    ->whereNotExists(function (Builder $query) use ($locale): void {
                                        $query->selectRaw('1')
                                            ->from('profile_revision_translations as pt_locale')
                                            ->whereColumn('pt_locale.profile_revision_id', 'p.published_revision_id')
                                            ->where('pt_locale.locale', $locale);
                                    });
                            });
                    })
                    ->whereExists(function (Builder $query): void {
                        $query->selectRaw('1')
                            ->from('profile_revision_trajectory as trajectory')
                            ->whereColumn('trajectory.profile_revision_translation_id', 'pt.id')
                            ->where(fn ($visibility) => $visibility
                                ->where('trajectory.hidden', false)
                                ->orWhereNull('trajectory.hidden'));
                    });
            })
            ->limit(1);
    }

    private function publicContent(string $table, array $filters): Builder
    {
        $revisionTable = [
            'case_studies' => 'case_study_revisions',
            'experiments' => 'experiment_revisions',
            'projects' => 'project_revisions',
            'reference_collections' => 'reference_collection_revisions',
            'resources' => 'resource_revisions',
            'snippets' => 'snippet_revisions',
            'technologies' => 'technology_revisions',
            'topics' => 'topic_revisions',
            'writings' => 'writing_revisions',
        ][$table] ?? null;

        if ($revisionTable === null) {
            return DB::table($table)
                ->selectRaw('1')
                ->where($filters)
                ->limit(1);
        }

        return DB::table($table.' as content')
            ->selectRaw('1')
            ->whereNotNull('content.published_revision_id')
            ->whereExists(function (Builder $revision) use ($revisionTable, $filters): void {
                $revision
                    ->selectRaw('1')
                    ->from($revisionTable.' as public_revision')
                    ->whereColumn('public_revision.id', 'content.published_revision_id')
                    ->where(function (Builder $visibility): void {
                        $visibility
                            ->where('public_revision.hidden', false)
                            ->orWhereNull('public_revision.hidden');
                    });

                foreach ($filters as $field => $value) {
                    if ($field === 'hidden') {
                        continue;
                    }

                    $revision->where('public_revision.'.$field, $value);
                }
            })
            ->limit(1);
    }

    private function publicCredits(): Builder
    {
        return DB::table('credit_entries as entries')
            ->selectRaw('1')
            ->whereNotNull('entries.published_revision_id')
            ->whereExists(function (Builder $revision): void {
                $revision
                    ->selectRaw('1')
                    ->from('credit_entry_revisions as public_revision')
                    ->whereColumn('public_revision.id', 'entries.published_revision_id')
                    ->where('public_revision.active', true);
            })
            ->whereExists(function (Builder $category): void {
                $category
                    ->selectRaw('1')
                    ->from('credit_categories')
                    ->whereColumn('credit_categories.slug', 'entries.category')
                    ->where('credit_categories.active', true);
            })
            ->limit(1);
    }

    private function pageWithFields(string $slug, string $locale, array $fields): Builder
    {
        return DB::table('pages as p')
            ->selectRaw('1')
            ->where('p.slug', $slug)
            ->whereNotNull('p.published_revision_id')
            ->whereExists(function (Builder $query): void {
                $query->selectRaw('1')
                    ->from('page_revisions as pr')
                    ->whereColumn('pr.id', 'p.published_revision_id')
                    ->where(fn ($visibility) => $visibility
                        ->where('pr.hidden', false)
                        ->orWhereNull('pr.hidden'));
            })
            ->where(function (Builder $query) use ($locale, $fields): void {
                $query->whereExists($this->pageTranslationWithFields($locale, $fields))
                    ->orWhere(function (Builder $query) use ($locale, $fields): void {
                        $query->whereNotExists(function (Builder $query) use ($locale): void {
                            $query->selectRaw('1')
                                ->from('page_revision_translations as locale_translation')
                                ->whereColumn('locale_translation.page_revision_id', 'p.published_revision_id')
                                ->where('locale_translation.locale', $locale);
                        })->whereExists($this->pageTranslationWithFields('en', $fields));
                    });
            })
            ->limit(1);
    }

    private function pageTranslationWithFields(string $locale, array $fields): \Closure
    {
        return function (Builder $query) use ($locale, $fields): void {
            $query->selectRaw('1')
                ->from('page_revision_translations as page_translation')
                ->whereColumn('page_translation.page_revision_id', 'p.published_revision_id')
                ->where('page_translation.locale', $locale)
                ->where(function (Builder $query) use ($fields): void {
                    foreach ($fields as $index => $field) {
                        $method = $index === 0 ? 'where' : 'orWhere';
                        $query->{$method}(function (Builder $query) use ($field): void {
                            $query->whereNotNull('page_translation.'.$field)
                                ->where('page_translation.'.$field, '<>', '');
                        });
                    }
                });
        };
    }

    private function boolean(mixed $value): bool
    {
        return $value === true || $value === 1 || $value === '1';
    }
}
