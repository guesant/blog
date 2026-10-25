<?php

namespace App\ReadModel\PublicSite\Chrome;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

final class PublicSiteAvailabilityReader
{
    public function read(string $locale, bool $hasProfile, bool $contactEnabled): array
    {
        $result = DB::query()
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
            ->selectSub($this->publicContent('topics', ['hidden' => false]), 'has_topics')
            ->selectSub($this->publicContent('reference_collections', ['hidden' => false]), 'has_collections')
            ->selectSub($this->publicContent('snippets', ['hidden' => false]), 'has_snippets')
            ->first();

        $hasWriting = $this->boolean($result?->has_writing);
        $hasCollections = $this->boolean($result?->has_collections);

        return [
            'about' => $hasProfile,
            'contact' => $contactEnabled,
            'license' => $this->boolean($result?->has_license),
            'credits' => $this->boolean($result?->has_credits),
            'follow' => $this->boolean($result?->has_follow),
            'feed' => $hasWriting || $hasCollections,
            'writing' => $hasWriting,
            'topics' => $this->boolean($result?->has_topics),
            'collections' => $hasCollections,
            'snippets' => $this->boolean($result?->has_snippets),
            'right_sidebar' => $contactEnabled,
        ];
    }

    private function publicContent(string $table, array $filters): Builder
    {
        $revisionTable = [
            'reference_collections' => 'reference_collection_revisions',
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
