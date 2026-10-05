<?php

use App\Content\PublicSiteChromeCache;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            foreach ($this->revisionTranslationDefinitions() as $definition) {
                $this->normalizeRevisionTranslations($definition);
            }

            $this->normalizeProfileMilestones();
            $this->normalizeCreditCategories();
            $this->normalizePlatforms();
        });

        app(PublicSiteChromeCache::class)->forgetAll();
    }

    public function down(): void {}

    private function revisionTranslationDefinitions(): array
    {
        return [
            ['identity' => 'pages', 'revision' => 'page_revisions', 'translation' => 'page_revision_translations', 'headings' => [
                'activitypub_title', 'ai_heading', 'api_title', 'atom_title', 'available_label', 'code_heading',
                'contact_title', 'content_heading', 'currently_exploring_label', 'experience_title', 'experiments_title',
                'future_title', 'hero_identity', 'jsonfeed_title', 'planned_title', 'projects_title', 'robots_title',
                'rss_title', 'section_label', 'section_title', 'selected_label', 'sitemap_title', 'story_title',
                'timeline_title', 'title', 'unavailable_label', 'webfinger_title', 'webmention_title', 'websub_title',
                'work_title', 'writing_title',
            ], 'skip' => ['code_body']],
            ['identity' => 'writings', 'revision' => 'writing_revisions', 'translation' => 'writing_revision_translations', 'headings' => ['title']],
            ['identity' => 'resources', 'revision' => 'resource_revisions', 'translation' => 'resource_revision_translations', 'headings' => ['title', 'alternative_title']],
            ['identity' => 'case_studies', 'revision' => 'case_study_revisions', 'translation' => 'case_study_revision_translations', 'headings' => ['status', 'title']],
            ['identity' => 'projects', 'revision' => 'project_revisions', 'translation' => 'project_revision_translations', 'headings' => ['name', 'status']],
            ['identity' => 'experiments', 'revision' => 'experiment_revisions', 'translation' => 'experiment_revision_translations', 'headings' => ['name']],
            ['identity' => 'reference_collections', 'revision' => 'reference_collection_revisions', 'translation' => 'reference_collection_revision_translations', 'headings' => ['title']],
            ['identity' => 'credit_entries', 'revision' => 'credit_entry_revisions', 'translation' => 'credit_entry_revision_translations', 'headings' => ['name']],
            ['identity' => 'snippets', 'revision' => 'snippet_revisions', 'translation' => 'snippet_revision_translations', 'headings' => ['title']],
            ['identity' => 'technologies', 'revision' => 'technology_revisions', 'translation' => 'technology_revision_translations', 'headings' => ['name']],
            ['identity' => 'topics', 'revision' => 'topic_revisions', 'translation' => 'topic_revision_translations', 'headings' => ['name']],
            ['identity' => 'languages', 'revision' => 'language_revisions', 'translation' => 'language_revision_translations', 'headings' => ['name']],
            ['identity' => 'profiles', 'revision' => 'profile_revisions', 'translation' => 'profile_revision_translations', 'headings' => ['birth_city', 'location', 'title']],
            ['identity' => 'resumes', 'revision' => 'resume_revisions', 'translation' => 'resume_revision_translations', 'headings' => []],
            ['identity' => 'site_settings', 'revision' => 'site_settings_revisions', 'translation' => 'site_settings_revision_translations', 'headings' => ['maintenance_title']],
            ['identity' => 'nav_items', 'revision' => 'nav_item_revisions', 'translation' => 'nav_item_revision_translations', 'headings' => ['label']],
        ];
    }

    private function normalizeRevisionTranslations(array $definition): void
    {
        if (! Schema::hasTable($definition['identity']) || ! Schema::hasTable($definition['translation'])) {
            return;
        }

        $revisionIds = DB::table($definition['identity'])
            ->select(['current_revision_id', 'published_revision_id'])
            ->get()
            ->flatMap(static fn (object $record): array => [
                $record->current_revision_id,
                $record->published_revision_id,
            ])
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($revisionIds === []) {
            return;
        }

        $foreignKey = Str::singular($definition['revision']).'_id';
        $columns = array_flip(Schema::getColumnListing($definition['translation']));
        $headings = $definition['headings'];
        $skippedColumns = $definition['skip'] ?? [];

        DB::table($definition['translation'])
            ->whereIn($foreignKey, $revisionIds)
            ->orderBy('id')
            ->get()
            ->each(function (object $translation) use ($columns, $definition, $headings, $foreignKey, $skippedColumns): void {
                $updates = [];

                foreach (array_keys($columns) as $column) {
                    if (in_array($column, ['id', $foreignKey, 'locale', 'created_at', 'updated_at'], true) || in_array($column, $skippedColumns, true)) {
                        continue;
                    }

                    $value = $translation->{$column} ?? null;

                    if (! is_string($value) || trim($value) === '') {
                        continue;
                    }

                    $normalized = in_array($column, $headings, true)
                        ? $this->titleCase($value)
                        : $this->sentenceCase($value);

                    if ($normalized !== $value) {
                        $updates[$column] = $normalized;
                    }
                }

                if ($updates !== []) {
                    DB::table($definition['translation'])
                        ->where('id', $translation->id)
                        ->update([...$updates, 'updated_at' => now()]);
                }
            });
    }

    private function normalizeProfileMilestones(): void
    {
        if (! Schema::hasTable('profiles') || ! Schema::hasTable('profile_revision_milestones')) {
            return;
        }

        $revisionIds = DB::table('profiles')
            ->select(['current_revision_id', 'published_revision_id'])
            ->get()
            ->flatMap(static fn (object $record): array => [
                $record->current_revision_id,
                $record->published_revision_id,
            ])
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($revisionIds === []) {
            return;
        }

        $translationIds = DB::table('profile_revision_translations')
            ->whereIn('profile_revision_id', $revisionIds)
            ->pluck('id')
            ->all();

        DB::table('profile_revision_milestones')
            ->whereIn('profile_revision_translation_id', $translationIds)
            ->get()
            ->each(function (object $milestone): void {
                $updates = [];

                if (is_string($milestone->title) && trim($milestone->title) !== '') {
                    $updates['title'] = $this->titleCase($milestone->title);
                }

                if (is_string($milestone->description) && trim($milestone->description) !== '') {
                    $updates['description'] = $this->sentenceCase($milestone->description);
                }

                if ($updates !== []) {
                    DB::table('profile_revision_milestones')
                        ->where('id', $milestone->id)
                        ->update($updates);
                }
            });
    }

    private function normalizeCreditCategories(): void
    {
        if (! Schema::hasTable('credit_category_translations')) {
            return;
        }

        DB::table('credit_category_translations')
            ->get()
            ->each(function (object $translation): void {
                if (! is_string($translation->name) || trim($translation->name) === '') {
                    return;
                }

                $normalized = $this->titleCase($translation->name);

                if ($normalized !== $translation->name) {
                    DB::table('credit_category_translations')
                        ->where('id', $translation->id)
                        ->update(['name' => $normalized, 'updated_at' => now()]);
                }
            });
    }

    private function normalizePlatforms(): void
    {
        if (! Schema::hasTable('platforms')) {
            return;
        }

        DB::table('platforms')
            ->get()
            ->each(function (object $platform): void {
                if (! is_string($platform->label) || trim($platform->label) === '') {
                    return;
                }

                $normalized = $this->titleCase($platform->label);

                if ($normalized !== $platform->label) {
                    DB::table('platforms')
                        ->where('id', $platform->id)
                        ->update(['label' => $normalized, 'updated_at' => now()]);
                }
            });
    }

    private function sentenceCase(string $value): string
    {
        return preg_replace_callback(
            '/(^|[.!?]\s+|\n\s*(?:[-*]\s+|#+\s+))(\p{Ll})/u',
            static fn (array $match): string => $match[1].mb_strtoupper($match[2], 'UTF-8'),
            trim($value),
        ) ?? $value;
    }

    private function titleCase(string $value): string
    {
        $value = trim($value);
        $specialCases = [
            'abac' => 'ABAC',
            'activitypub' => 'ActivityPub',
            'ai' => 'AI',
            'api' => 'API',
            'crdt' => 'CRDT',
            'cpu' => 'CPU',
            'css' => 'CSS',
            'dns' => 'DNS',
            'github' => 'GitHub',
            'gitlab' => 'GitLab',
            'gpu' => 'GPU',
            'html' => 'HTML',
            'http' => 'HTTP',
            'https' => 'HTTPS',
            'ip' => 'IP',
            'ipv4' => 'IPv4',
            'ipv6' => 'IPv6',
            'linkedin' => 'LinkedIn',
            'json' => 'JSON',
            'mtls' => 'mTLS',
            'oauth' => 'OAuth',
            'openid' => 'OpenID',
            'openapi' => 'OpenAPI',
            'oidc' => 'OIDC',
            'orcid' => 'ORCID',
            'pdf' => 'PDF',
            'postgresql' => 'PostgreSQL',
            'ram' => 'RAM',
            'rbac' => 'RBAC',
            'rss' => 'RSS',
            'saml' => 'SAML',
            'sql' => 'SQL',
            'ssh' => 'SSH',
            'tls' => 'TLS',
            'url' => 'URL',
            'youtube' => 'YouTube',
            'webfinger' => 'WebFinger',
            'websub' => 'WebSub',
            'webmention' => 'Webmention',
            'robots.txt' => 'robots.txt',
        ];

        $specialCase = $specialCases[mb_strtolower($value, 'UTF-8')] ?? null;

        if ($specialCase !== null) {
            return $specialCase;
        }

        $parts = preg_split('/(\s+)/u', $value, -1, PREG_SPLIT_DELIM_CAPTURE);

        if ($parts === false) {
            return $value;
        }

        $wordIndexes = array_keys(array_filter(
            $parts,
            static fn (mixed $part): bool => is_string($part) && ! preg_match('/^\s+$/u', $part),
        ));
        $lastWordIndex = array_pop($wordIndexes);
        $wordPosition = 0;
        $stopWords = ['a', 'an', 'and', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'ao', 'aos', 'as', 'com', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'na', 'nas', 'no', 'nos', 'ou', 'para', 'por', 'um', 'uma'];

        foreach ($parts as $index => $part) {
            if (! is_string($part) || preg_match('/^\s+$/u', $part)) {
                continue;
            }

            $letters = preg_replace('/[^\p{L}\p{M}]/u', '', $part) ?? '';
            $lowerWord = mb_strtolower($letters, 'UTF-8');

            if (isset($specialCases[$lowerWord]) && $letters === $part) {
                $parts[$index] = $specialCases[$lowerWord];
                $wordPosition++;
                continue;
            }

            if ($letters !== '' && mb_strtoupper($letters, 'UTF-8') === $letters && mb_strlen($letters, 'UTF-8') > 1) {
                $wordPosition++;
                continue;
            }

            if (preg_match('/\p{Lu}/u', $letters) && preg_match('/\p{Ll}/u', $letters)) {
                $wordPosition++;
                continue;
            }

            $normalized = mb_strtolower($part, 'UTF-8');
            $word = mb_strtolower($letters, 'UTF-8');

            if ($wordPosition !== 0 && $index !== $lastWordIndex && in_array($word, $stopWords, true)) {
                $parts[$index] = $normalized;
            } else {
                $parts[$index] = preg_replace_callback(
                    '/(^|[-\/])(\p{Ll})/u',
                    static fn (array $match): string => $match[1].mb_strtoupper($match[2], 'UTF-8'),
                    $normalized,
                ) ?? $part;
            }

            $wordPosition++;
        }

        return implode('', $parts);
    }
};
