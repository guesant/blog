<?php

namespace App\Content;

use App\Events\PublicSiteContentChanged;
use App\Models\Writing;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EditorialRevisionPublisher
{
    private const DEFINITIONS = [
        'pages' => ['revision' => 'page_revisions', 'revision_key' => 'page_id', 'translation' => 'page_revision_translations', 'columns' => ['slug', 'hidden'], 'page_fields' => true],
        'profiles' => ['revision' => 'profile_revisions', 'revision_key' => 'profile_id', 'translation' => 'profile_revision_translations', 'columns' => ['name', 'birth_date', 'hidden'], 'profile_fields' => true],
        'reference_collections' => ['revision' => 'reference_collection_revisions', 'revision_key' => 'reference_collection_id', 'translation' => 'reference_collection_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'order', 'image', 'published_at'], 'translation_columns' => ['title', 'description', 'intro']],
        'writings' => ['revision' => 'writing_revisions', 'revision_key' => 'writing_id', 'translation' => 'writing_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'date_iso', 'type', 'show_history'], 'translation_columns' => ['title', 'reading_time', 'body']],
        'site_settings' => ['revision' => 'site_settings_revisions', 'revision_key' => 'site_settings_id', 'translation' => 'site_settings_revision_translations', 'columns' => ['short_name', 'maintenance_enabled', 'contact_email', 'contact_enabled', 'contact_available', 'source_repository_url', 'content_actions_copy_text', 'content_actions_copy_url', 'content_actions_download_text', 'contextual_cursor_enabled', 'feed_flat_cards_enabled'], 'translation_columns' => ['copyright_template', 'maintenance_title', 'maintenance_description']],
        'nav_items' => ['revision' => 'nav_item_revisions', 'revision_key' => 'nav_item_id', 'translation' => null, 'columns' => ['route_name', 'parent_id', 'placement', 'sidebar_group_id', 'order', 'hidden'], 'translation_columns' => []],
        'credit_entries' => ['revision' => 'credit_entry_revisions', 'revision_key' => 'credit_entry_id', 'translation' => 'credit_entry_revision_translations', 'columns' => ['url', 'category', 'order', 'is_automatic', 'active', 'package_manager', 'package_name'], 'translation_columns' => ['name', 'description']],
        'snippets' => ['revision' => 'snippet_revisions', 'revision_key' => 'snippet_id', 'translation' => 'snippet_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'show_history', 'order', 'published_at'], 'translation_columns' => ['title', 'description']],
        'technologies' => ['revision' => 'technology_revisions', 'revision_key' => 'technology_id', 'translation' => 'technology_revision_translations', 'columns' => ['slug', 'public_id', 'order', 'code', 'logo', 'hidden'], 'translation_columns' => ['name']],
        'topics' => ['revision' => 'topic_revisions', 'revision_key' => 'topic_id', 'translation' => 'topic_revision_translations', 'columns' => ['slug', 'public_id', 'order', 'kind', 'parent_id', 'hidden'], 'translation_columns' => ['name']],
        'languages' => ['revision' => 'language_revisions', 'revision_key' => 'language_id', 'translation' => 'language_revision_translations', 'columns' => ['slug', 'order', 'code'], 'translation_columns' => ['name']],
    ];

    public function publish(Model $record, array $translations, array $recordData = []): void
    {
        $definition = self::DEFINITIONS[$record->getTable()] ?? null;
        if ($definition === null) {
            return;
        }

        DB::transaction(function () use ($record, $definition, $translations, $recordData): void {
            $revisionId = $this->createRevision($record, $definition, $recordData);
            $this->createTranslations($record, $definition, $revisionId, $translations);
            $this->updatePointers($record, $revisionId);
        });

        PublicSiteContentChanged::dispatch();
    }

    public function syncPageRelations(Model $record, ?array $homeSections = null): void
    {
        if ($record->getTable() !== 'pages' || $record->current_revision_id === null) {
            return;
        }

        $revisionId = $record->current_revision_id;
        DB::transaction(function () use ($record, $revisionId, $homeSections): void {
            if ($homeSections !== null && $record->getAttribute('slug') === 'home') {
                DB::table('page_revision_home_sections')
                    ->where('page_revision_id', $revisionId)
                    ->whereIn('section_key', array_keys(HomeGallerySection::DEFAULTS))
                    ->delete();

                foreach (array_keys(HomeGallerySection::DEFAULTS) as $sortOrder => $sectionKey) {
                    DB::table('page_revision_home_sections')->insert([
                        'page_revision_id' => $revisionId,
                        'section_key' => $sectionKey,
                        'enabled' => in_array($sectionKey, $homeSections, true),
                        'sort_order' => $sortOrder,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        });

        PublicSiteContentChanged::dispatch();
    }

    private function createRevision(Model $record, array $definition, array $recordData): int
    {
        $revisionNumber = ((int) DB::table($definition['revision'])
            ->where($definition['revision_key'], $record->getKey())
            ->max('revision_number')) + 1;
        $data = [
            $definition['revision_key'] => $record->getKey(),
            'revision_number' => $revisionNumber,
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
        ];

        foreach ($definition['columns'] as $column) {
            $data[$column] = $recordData[$column] ?? $record->getAttribute($column);

            if ($column === 'hidden' && $data[$column] === null) {
                $data[$column] = false;
            }
        }

        return (int) DB::table($definition['revision'])->insertGetId($data);
    }

    private function createTranslations(Model $record, array $definition, int $revisionId, array $translations): void
    {
        if ($definition['translation'] === null) {
            return;
        }

        $revisionKey = Str::singular($definition['revision']).'_id';
        foreach ($translations as $locale => $fields) {
            $translation = [$revisionKey => $revisionId, 'locale' => $locale, 'created_at' => now(), 'updated_at' => now()];
            if (($definition['page_fields'] ?? false) === true) {
                foreach ($fields['fields'] ?? $fields as $key => $value) {
                    $column = Str::snake((string) $key);
                    if (is_string($value) && DB::getSchemaBuilder()->hasColumn($definition['translation'], $column)) {
                        $translation[$column] = $value;
                    }
                }
            } elseif (($definition['profile_fields'] ?? false) === true) {
                $this->profileTranslation($translation, $fields);
            } else {
                foreach ($definition['translation_columns'] as $column) {
                    $translation[$column] = $this->translationColumnValue($record, $locale, $column, $fields);
                }
            }

            $translationId = (int) DB::table($definition['translation'])->insertGetId($translation);
            if (($definition['profile_fields'] ?? false) === true) {
                $this->profileRows($translationId, $fields);
            }
            $this->structuredTranslation($record->getTable(), $translationId, $fields);
        }
    }

    private function translationColumnValue(Model $record, string $locale, string $column, array $fields): mixed
    {
        if (array_key_exists($column, $fields)) {
            return $fields[$column];
        }

        if ($record instanceof Writing && $column === 'reading_time') {
            return $record->translation($locale)?->getAttribute('reading_time');
        }

        return null;
    }

    private function profileTranslation(array &$translation, array $fields): void
    {
        foreach (['title', 'location', 'birth_city', 'description', 'interests', 'learning'] as $column) {
            $translation[$column] = $fields[$column] ?? null;
        }
    }

    private function profileRows(int $translationId, array $fields): void
    {
        foreach ($fields['personal_interests'] ?? [] as $order => $value) {
            $text = is_scalar($value) ? (string) $value : (string) ($value['value'] ?? '');
            DB::table('profile_revision_interests')->insert(['profile_revision_translation_id' => $translationId, 'value' => $text, 'sort_order' => $order]);
        }
        foreach (['fortunes', 'personal_facts'] as $field) {
            $table = 'profile_revision_'.match ($field) {
                'personal_facts' => 'facts',
                default => $field,
            };
            foreach ($fields[$field] ?? [] as $order => $value) {
                $text = is_scalar($value) ? (string) $value : (string) ($value['value'] ?? '');
                DB::table($table)->insert(['profile_revision_translation_id' => $translationId, 'value' => $text, 'sort_order' => $order]);
            }
        }
        foreach ($fields['personal_things'] ?? [] as $order => $value) {
            $item = is_array($value) ? $value : ['label' => (string) $value];
            DB::table('profile_revision_things')->insert([
                'profile_revision_translation_id' => $translationId,
                'value' => $item['label'] ?? ($item['value'] ?? ''),
                'label' => $item['label'] ?? null,
                'since' => $item['since'] ?? null,
                'sort_order' => $order,
            ]);
        }
        foreach ($fields['trajectory'] ?? [] as $order => $item) {
            $trajectoryId = DB::table('profile_revision_trajectory')->insertGetId([
                'profile_revision_translation_id' => $translationId,
                'role' => $item['role'] ?? null,
                'organization' => $item['organization'] ?? null,
                'period' => $item['period'] ?? null,
                'hidden' => $item['hidden'] ?? false,
                'sort_order' => $order,
            ]);
            foreach ($item['highlights'] ?? [] as $highlightOrder => $highlight) {
                DB::table('profile_revision_trajectory_highlights')->insert(['trajectory_id' => $trajectoryId, 'value' => (string) $highlight, 'sort_order' => $highlightOrder]);
            }
        }
        foreach ($fields['milestones'] ?? [] as $order => $item) {
            DB::table('profile_revision_milestones')->insert([
                'profile_revision_translation_id' => $translationId,
                'year' => $item['year'] ?? null,
                'title' => $item['title'] ?? null,
                'description' => $item['description'] ?? null,
                'hidden' => $item['hidden'] ?? false,
                'sort_order' => $order,
            ]);
        }
    }

    private function structuredTranslation(string $table, int $translationId, array $fields): void
    {
        $contentType = match ($table) {
            'site_settings' => 'site_settings',
            default => Str::singular($table),
        };
        if (isset($fields['metrics']) && is_array($fields['metrics'])) {
            foreach ($fields['metrics'] as $order => $metric) {
                if (! is_array($metric)) {
                    continue;
                }
                DB::table('content_revision_metrics')->insert([
                    'content_type' => $contentType,
                    'translation_id' => $translationId,
                    'name' => (string) ($metric['name'] ?? $metric['label'] ?? $order),
                    'value' => isset($metric['value']) ? (string) $metric['value'] : null,
                    'unit' => isset($metric['unit']) ? (string) $metric['unit'] : null,
                    'sort_order' => $order,
                ]);
            }
        }
    }

    private function updatePointers(Model $record, int $revisionId): void
    {
        $isPublic = ! $record->getAttribute('hidden');
        DB::table($record->getTable())->where('id', $record->getKey())->update([
            'current_revision_id' => $revisionId,
            'published_revision_id' => $isPublic ? $revisionId : null,
        ]);

        DB::table('content_publications')
            ->where('content_type', $record->getTable())
            ->where('content_id', $record->getKey())
            ->whereNull('unpublished_at')
            ->update(['unpublished_at' => now()]);

        if ($isPublic) {
            DB::table('content_publications')->insert([
                'content_type' => $record->getTable(),
                'content_id' => $record->getKey(),
                'revision_id' => $revisionId,
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);
        }
    }
}
