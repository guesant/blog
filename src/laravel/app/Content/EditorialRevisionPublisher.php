<?php

namespace App\Content;

use App\Events\PublicSiteContentChanged;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EditorialRevisionPublisher
{
    private const DEFINITIONS = [
        'resources' => ['revision' => 'resource_revisions', 'revision_key' => 'resource_id', 'translation' => 'resource_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'order', 'type', 'language_id', 'published_date_iso', 'found_date_iso', 'consumption_state', 'rating', 'editorial_state', 'visibility', 'featured', 'featured_order', 'popularity_kind', 'popularity_rank', 'popularity_refreshed_at', 'popularity_value'], 'translation_columns' => ['title', 'alternative_title', 'description', 'personal_note', 'reason_found']],
        'pages' => ['revision' => 'page_revisions', 'revision_key' => 'page_id', 'translation' => 'page_revision_translations', 'columns' => ['slug', 'hidden'], 'page_fields' => true],
        'profiles' => ['revision' => 'profile_revisions', 'revision_key' => 'profile_id', 'translation' => 'profile_revision_translations', 'columns' => ['name', 'birth_date', 'hidden'], 'profile_fields' => true],
        'resumes' => ['revision' => 'resume_revisions', 'revision_key' => 'resume_id', 'translation' => 'resume_revision_translations', 'columns' => ['hidden'], 'resume_fields' => true],
        'case_studies' => ['revision' => 'case_study_revisions', 'revision_key' => 'case_study_id', 'translation' => 'case_study_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'visual', 'nda', 'published_at', 'show_history'], 'translation_columns' => ['title', 'status', 'meta', 'summary', 'context', 'role', 'result', 'body']],
        'experiments' => ['revision' => 'experiment_revisions', 'revision_key' => 'experiment_id', 'translation' => 'experiment_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'published_at', 'show_history'], 'translation_columns' => ['name', 'purpose', 'body']],
        'projects' => ['revision' => 'project_revisions', 'revision_key' => 'project_id', 'translation' => 'project_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'nda', 'published_at', 'show_history'], 'translation_columns' => ['name', 'purpose', 'problem', 'current_focus', 'status', 'body']],
        'reference_collections' => ['revision' => 'reference_collection_revisions', 'revision_key' => 'reference_collection_id', 'translation' => 'reference_collection_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'order', 'image', 'published_at'], 'translation_columns' => ['title', 'description', 'intro']],
        'writings' => ['revision' => 'writing_revisions', 'revision_key' => 'writing_id', 'translation' => 'writing_revision_translations', 'columns' => ['slug', 'public_id', 'hidden', 'date_iso', 'type', 'show_history'], 'translation_columns' => ['title', 'excerpt', 'reading_time', 'body']],
        'site_settings' => ['revision' => 'site_settings_revisions', 'revision_key' => 'site_settings_id', 'translation' => 'site_settings_revision_translations', 'columns' => ['short_name', 'portfolio_url', 'maintenance_enabled', 'contact_email', 'contact_available', 'source_repository_url'], 'translation_columns' => ['copyright_template', 'maintenance_eyebrow', 'maintenance_title', 'maintenance_description']],
        'nav_items' => ['revision' => 'nav_item_revisions', 'revision_key' => 'nav_item_id', 'translation' => null, 'columns' => ['route_name', 'parent_id', 'placement', 'sidebar_group', 'order'], 'translation_columns' => []],
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
            if ($record->getTable() === 'resources') {
                $this->resourceRelations($record, $revisionId, $recordData);
            }
            $this->updatePointers($record, $revisionId);
        });

        PublicSiteContentChanged::dispatch();
    }

    public function syncResumeRelations(Model $record): void
    {
        if ($record->getTable() !== 'resumes' || $record->current_revision_id === null) {
            return;
        }

        DB::transaction(function () use ($record): void {
            $revisionId = $record->current_revision_id;
            DB::table('resume_revision_selected_cases')->where('resume_revision_id', $revisionId)->delete();
            DB::table('resume_revision_skills')->where('resume_revision_id', $revisionId)->delete();
            DB::table('resume_revision_skill_technologies')->where('resume_revision_id', $revisionId)->delete();
            DB::table('resume_revision_languages')->where('resume_revision_id', $revisionId)->delete();

            foreach ($record->selectedCases()->get() as $case) {
                DB::table('resume_revision_selected_cases')->insert([
                    'resume_revision_id' => $revisionId,
                    'case_study_id' => $case->id,
                    'sort_order' => $case->pivot->order ?? 0,
                ]);
            }

            foreach ($record->skills()->with('technologies')->get() as $skill) {
                DB::table('resume_revision_skills')->insert([
                    'resume_revision_id' => $revisionId,
                    'topic_id' => $skill->topic_id,
                    'sort_order' => $skill->order ?? 0,
                ]);
                foreach ($skill->technologies as $technologyOrder => $technology) {
                    DB::table('resume_revision_skill_technologies')->insert([
                        'resume_revision_id' => $revisionId,
                        'topic_id' => $skill->topic_id,
                        'technology_id' => $technology->id,
                        'sort_order' => $technologyOrder,
                    ]);
                }
            }

            foreach ($record->languages()->get() as $language) {
                DB::table('resume_revision_languages')->insert([
                    'resume_revision_id' => $revisionId,
                    'language_id' => $language->language_id,
                    'proficiency' => $language->proficiency,
                    'sort_order' => $language->order ?? 0,
                ]);
            }
        });

        PublicSiteContentChanged::dispatch();
    }

    public function syncPageRelations(Model $record): void
    {
        if ($record->getTable() !== 'pages' || $record->current_revision_id === null) {
            return;
        }

        $revisionId = $record->current_revision_id;
        DB::transaction(function () use ($record, $revisionId): void {
            $relations = [
                ['relation' => 'featuredCases', 'table' => 'page_revision_featured_cases', 'column' => 'case_study_id'],
                ['relation' => 'featuredProjects', 'table' => 'page_revision_featured_projects', 'column' => 'project_id'],
                ['relation' => 'featuredWritings', 'table' => 'page_revision_featured_writings', 'column' => 'writing_id'],
            ];

            foreach ($relations as $relation) {
                DB::table($relation['table'])->where('page_revision_id', $revisionId)->delete();
                foreach ($record->{$relation['relation']}()->get() as $item) {
                    DB::table($relation['table'])->insert([
                        'page_revision_id' => $revisionId,
                        $relation['column'] => $item->id,
                        'sort_order' => $item->pivot->order ?? 0,
                    ]);
                }
            }
        });

        PublicSiteContentChanged::dispatch();
    }

    public function syncReferenceCollectionRelations(Model $record): void
    {
        if ($record->getTable() !== 'reference_collections' || $record->current_revision_id === null) {
            return;
        }

        DB::transaction(function () use ($record): void {
            $revisionId = $record->current_revision_id;
            DB::table('reference_collection_revision_resources')->where('reference_collection_revision_id', $revisionId)->delete();
            foreach ($record->resources()->get() as $resource) {
                DB::table('reference_collection_revision_resources')->insert([
                    'reference_collection_revision_id' => $revisionId,
                    'resource_id' => $resource->id,
                    'note' => $resource->pivot->note,
                    'sort_order' => $resource->pivot->order ?? 0,
                ]);
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
            } elseif (($definition['resume_fields'] ?? false) === true) {
                $this->resumeTranslation($translation, $fields);
            } else {
                foreach ($definition['translation_columns'] as $column) {
                    $translation[$column] = $fields[$column] ?? null;
                }
            }

            $translationId = (int) DB::table($definition['translation'])->insertGetId($translation);
            if (($definition['profile_fields'] ?? false) === true) {
                $this->profileRows($translationId, $fields);
            }
            if (($definition['resume_fields'] ?? false) === true) {
                $this->resumeRows($translationId, $fields);
            }
            $this->structuredTranslation($record->getTable(), $translationId, $fields);
        }
    }

    private function profileTranslation(array &$translation, array $fields): void
    {
        foreach (['title', 'location', 'birth_city', 'description', 'interests', 'learning'] as $column) {
            $translation[$column] = $fields[$column] ?? null;
        }
    }

    private function resumeTranslation(array &$translation, array $fields): void
    {
        $translation['summary'] = $fields['summary'] ?? null;
    }

    private function resumeRows(int $translationId, array $fields): void
    {
        foreach (['leadership', 'education', 'certificates', 'certifications', 'publications', 'recommendations', 'technical_productions', 'events', 'awards'] as $kind) {
            foreach ($fields[$kind] ?? [] as $order => $item) {
                $data = ['resume_revision_translation_id' => $translationId, 'sort_order' => $order];
                foreach ((array) $item as $key => $value) {
                    $column = match ([$kind, (string) $key]) {
                        ['certificates', 'credentialId'], ['certifications', 'credentialId'] => 'credential_id',
                        ['publications', 'name'], ['publications', 'issuer'] => (string) $key,
                        ['recommendations', 'author'] => 'author',
                        ['recommendations', 'quote'] => 'quote',
                        ['events', 'talkTitle'] => 'talk_title',
                        default => Str::snake((string) $key),
                    };
                    if (is_scalar($value) && DB::getSchemaBuilder()->hasColumn('resume_revision_'.$kind, $column)) {
                        $data[$column] = $value;
                    }
                }
                DB::table('resume_revision_'.$kind)->insert($data);
            }
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
                'include_in_resume' => $item['includeInResume'] ?? false,
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
        if (isset($fields['seo']) && is_array($fields['seo'])) {
            DB::table('content_revision_seo')->insert([
                'content_type' => $contentType,
                'translation_id' => $translationId,
                'title' => $fields['seo']['title'] ?? null,
                'description' => $fields['seo']['description'] ?? null,
                'canonical_url' => $fields['seo']['canonical'] ?? ($fields['seo']['canonical_url'] ?? null),
                'image_url' => $fields['seo']['image'] ?? ($fields['seo']['image_url'] ?? null),
                'image_alt' => $fields['seo']['imageAlt'] ?? ($fields['seo']['image_alt'] ?? null),
                'robots' => $fields['seo']['robots'] ?? null,
                'no_index' => $fields['seo']['noIndex'] ?? ($fields['seo']['no_index'] ?? false),
            ]);

            foreach ($fields['seo']['keywords'] ?? [] as $order => $keyword) {
                DB::table('content_revision_seo_keywords')->insert([
                    'content_type' => $contentType,
                    'translation_id' => $translationId,
                    'keyword' => (string) $keyword,
                    'sort_order' => $order,
                ]);
            }
        }
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

    private function resourceRelations(Model $record, int $revisionId, array $recordData): void
    {
        foreach ($record->links()->get() as $link) {
            DB::table('resource_revision_links')->insert([
                'resource_revision_id' => $revisionId,
                'url' => $link->url,
                'label' => $link->label,
                'platform' => $link->platform,
                'purpose' => $link->purpose,
                'is_primary' => $link->is_primary,
                'is_free' => $link->is_free,
                'language_id' => $link->language_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($record->identifiers()->get() as $identifier) {
            DB::table('resource_revision_identifiers')->insert([
                'resource_revision_id' => $revisionId,
                'kind' => $identifier->kind,
                'value' => $identifier->value,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($record->topics()->get() as $topic) {
            DB::table('resource_revision_topics')->insert([
                'resource_revision_id' => $revisionId,
                'topic_id' => $topic->id,
                'role' => $topic->pivot->role,
            ]);
        }

        foreach ($record->referenceCollections()->get() as $collection) {
            DB::table('resource_revision_collections')->insert([
                'resource_revision_id' => $revisionId,
                'reference_collection_id' => $collection->id,
                'note' => $collection->pivot->note,
                'sort_order' => $collection->pivot->order,
            ]);
        }

        foreach ([
            ['relation' => 'authorTopics', 'kind' => 'person'],
            ['relation' => 'publisherTopics', 'kind' => 'organization'],
        ] as $attribution) {
            foreach ($record->{$attribution['relation']}()->with('translations')->get() as $order => $topic) {
                DB::table('resource_revision_attributions')->insert([
                    'resource_revision_id' => $revisionId,
                    'kind' => $attribution['kind'],
                    'name' => $topic->translation('en')?->name ?? $topic->slug,
                    'sort_order' => $order,
                ]);
            }
        }

        $details = is_array($recordData['type_details'] ?? null) ? $recordData['type_details'] : [];
        if ($details !== []) {
            DB::table('resource_revision_type_details')->insert([
                'resource_revision_id' => $revisionId,
                'channel' => $details['channel'] ?? null,
                'conference' => $details['conference'] ?? null,
                'duration' => $details['duration'] ?? null,
                'edition' => $details['edition'] ?? null,
                'isbn' => $details['isbn'] ?? null,
                'language' => $details['language'] ?? null,
                'license' => $details['license'] ?? null,
                'name' => $details['name'] ?? null,
                'organization' => $details['org'] ?? ($details['organization'] ?? null),
                'pages' => $details['pages'] ?? null,
                'publisher' => $details['publisher'] ?? null,
                'year' => $details['year'] ?? null,
                'youtube_id' => $details['youtubeId'] ?? ($details['youtube_id'] ?? null),
            ]);
        }
    }

    private function updatePointers(Model $record, int $revisionId): void
    {
        $isPublic = ! $record->getAttribute('hidden');
        if ($record->getTable() === 'resources') {
            $isPublic = $isPublic && $record->getAttribute('visibility') === 'public';
        }
        if (in_array($record->getTable(), ['case_studies', 'projects'], true)) {
            $isPublic = $isPublic && ! $record->getAttribute('nda');
        }

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
