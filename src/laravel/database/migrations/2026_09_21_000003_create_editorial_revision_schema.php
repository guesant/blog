<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $this->renameRevisionCounter();
        $this->addIdentityPointers();
        $this->createRevisionTables();
        $this->createRelationTables();
        $this->backfillRevisions();
    }

    public function down(): void
    {
        $tables = [
            'content_publications',
            'resource_revision_type_details',
            'resource_revision_attributions',
            'resource_revision_collections',
            'resource_revision_topics',
            'resource_revision_identifiers',
            'resource_revision_links',
            'page_revision_featured_cases',
            'page_revision_featured_projects',
            'page_revision_featured_writings',
            'project_revision_technologies',
            'case_study_revision_technologies',
            'experiment_revision_technologies',
            'reference_collection_revision_resources',
            'resume_revision_selected_cases',
            'resume_revision_skills',
            'resume_revision_languages',
            'profile_revision_interests',
            'profile_revision_trajectory',
            'profile_revision_trajectory_highlights',
            'profile_revision_milestones',
            'profile_revision_fortunes',
            'profile_revision_facts',
            'profile_revision_things',
            'resume_revision_education',
            'resume_revision_leadership',
            'resume_revision_certificates',
            'resume_revision_certifications',
            'resume_revision_publications',
            'resume_revision_recommendations',
            'resume_revision_technical_productions',
            'resume_revision_events',
            'resume_revision_awards',
            'content_revision_metrics',
            'content_revision_seo',
        ];

        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }

        foreach ($this->revisionDefinitions() as $definition) {
            Schema::dropIfExists($definition['revision']);
            Schema::dropIfExists($definition['translation']);
        }

        foreach (array_keys($this->revisionDefinitions()) as $table) {
            if (Schema::hasColumn($table, 'current_revision_id')) {
                Schema::table($table, function (Blueprint $blueprint): void {
                    $blueprint->dropColumn(['current_revision_id', 'published_revision_id']);
                });
            }
        }

        if (Schema::hasTable('content_revision_counters') && ! Schema::hasTable('content_revisions')) {
            Schema::rename('content_revision_counters', 'content_revisions');
        }
    }

    private function renameRevisionCounter(): void
    {
        if (Schema::hasTable('content_revisions') && ! Schema::hasTable('content_revision_counters')) {
            Schema::rename('content_revisions', 'content_revision_counters');
        }
    }

    private function addIdentityPointers(): void
    {
        foreach (array_keys($this->revisionDefinitions()) as $table) {
            if (! Schema::hasTable($table)) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) use ($table): void {
                if (! Schema::hasColumn($table, 'current_revision_id')) {
                    $blueprint->unsignedInteger('current_revision_id')->nullable();
                }
                if (! Schema::hasColumn($table, 'published_revision_id')) {
                    $blueprint->unsignedInteger('published_revision_id')->nullable();
                }
            });
        }
    }

    private function createRevisionTables(): void
    {
        foreach ($this->revisionDefinitions() as $definition) {
            $this->createRevisionTable(
                $definition['revision'],
                $definition['identity'],
                $definition['identity_column'],
                $definition['columns'],
            );
            $this->createTranslationTable(
                $definition['translation'],
                $definition['revision'],
                $definition['translation_columns'],
            );
        }
    }

    private function createRevisionTable(
        string $table,
        string $identity,
        string $identityColumn,
        array $columns,
    ): void {
        if (Schema::hasTable($table)) {
            return;
        }

        Schema::create($table, function (Blueprint $blueprint) use ($identityColumn, $columns): void {
            $blueprint->increments('id');
            $blueprint->unsignedInteger($identityColumn);
            $blueprint->unsignedInteger('revision_number');

            foreach ($columns as $name => $type) {
                $this->addColumn($blueprint, $name, $type);
            }

            $blueprint->unsignedBigInteger('created_by')->nullable();
            $blueprint->timestamps();
            $blueprint->unique([$identityColumn, 'revision_number']);
            $blueprint->index([$identityColumn, 'id']);
        });
    }

    private function createTranslationTable(string $table, string $revision, array $columns): void
    {
        if (Schema::hasTable($table)) {
            return;
        }

        Schema::create($table, function (Blueprint $blueprint) use ($revision, $columns): void {
            $blueprint->increments('id');
            $blueprint->unsignedInteger(Str::singular($revision).'_id');
            $blueprint->string('locale', 16);

            foreach ($columns as $name => $type) {
                $this->addColumn($blueprint, $name, $type);
            }

            $blueprint->timestamps();
            $blueprint->unique([Str::singular($revision).'_id', 'locale']);
        });
    }

    private function addColumn(Blueprint $blueprint, string $name, string $type): void
    {
        [$kind, $length] = array_pad(explode(':', $type, 2), 2, null);
        $column = match ($kind) {
            'boolean' => $blueprint->boolean($name),
            'date' => $blueprint->date($name),
            'datetime' => $blueprint->dateTime($name),
            'integer' => $blueprint->integer($name),
            'bigInteger' => $blueprint->bigInteger($name),
            'double' => $blueprint->double($name),
            'text' => $blueprint->text($name),
            default => $blueprint->string($name, (int) ($length ?: 255)),
        };

        $column->nullable();
    }

    private function createRelationTables(): void
    {
        $this->createTable('content_publications', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('content_type', 80);
            $table->unsignedInteger('content_id');
            $table->unsignedInteger('revision_id');
            $table->unsignedBigInteger('published_by')->nullable();
            $table->timestamp('published_at');
            $table->timestamp('unpublished_at')->nullable();
            $table->index(['content_type', 'content_id', 'published_at']);
        });

        $this->createTable('content_revision_seo', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('content_type', 80);
            $table->unsignedInteger('translation_id');
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->text('canonical_url')->nullable();
            $table->text('image_url')->nullable();
            $table->string('robots')->nullable();
            $table->unique(['content_type', 'translation_id']);
        });

        $this->createTable('content_revision_metrics', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('content_type', 80);
            $table->unsignedInteger('translation_id');
            $table->string('name');
            $table->text('value')->nullable();
            $table->string('unit')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->index(['content_type', 'translation_id', 'sort_order']);
        });

        $this->createResourceRelations();
        $this->createFeatureRelations();
        $this->createProfileRelations();
        $this->createResumeRelations();
    }

    private function createResourceRelations(): void
    {
        $this->createTable('resource_revision_links', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('resource_revision_id');
            $table->text('url');
            $table->string('label')->nullable();
            $table->string('platform')->nullable();
            $table->string('purpose')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_free')->default(false);
            $table->unsignedInteger('language_id')->nullable();
            $table->timestamps();
            $table->index(['resource_revision_id', 'is_primary']);
        });

        $this->createTable('resource_revision_identifiers', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('resource_revision_id');
            $table->string('kind');
            $table->text('value');
            $table->timestamps();
            $table->index(['resource_revision_id', 'kind']);
        });

        $this->createTable('resource_revision_topics', function (Blueprint $table): void {
            $table->unsignedInteger('resource_revision_id');
            $table->unsignedInteger('topic_id');
            $table->string('role')->nullable();
            $table->primary(['resource_revision_id', 'topic_id', 'role']);
        });

        $this->createTable('resource_revision_collections', function (Blueprint $table): void {
            $table->unsignedInteger('resource_revision_id');
            $table->unsignedInteger('reference_collection_id');
            $table->text('note')->nullable();
            $table->unsignedInteger('sort_order')->nullable();
            $table->primary(['resource_revision_id', 'reference_collection_id']);
        });

        $this->createTable('resource_revision_attributions', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('resource_revision_id');
            $table->string('kind');
            $table->text('name');
            $table->unsignedInteger('sort_order')->default(0);
            $table->index(['resource_revision_id', 'kind', 'sort_order']);
        });

        $this->createTable('resource_revision_type_details', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('resource_revision_id');
            $table->string('channel')->nullable();
            $table->string('conference')->nullable();
            $table->string('duration')->nullable();
            $table->string('edition')->nullable();
            $table->string('isbn')->nullable();
            $table->string('language')->nullable();
            $table->string('license')->nullable();
            $table->string('name')->nullable();
            $table->string('organization')->nullable();
            $table->string('pages')->nullable();
            $table->string('publisher')->nullable();
            $table->string('year')->nullable();
            $table->string('youtube_id')->nullable();
            $table->unique('resource_revision_id');
        });
    }

    private function createFeatureRelations(): void
    {
        foreach ([
            'page_revision_featured_cases' => ['page_revision_id', 'case_study_id'],
            'page_revision_featured_projects' => ['page_revision_id', 'project_id'],
            'page_revision_featured_writings' => ['page_revision_id', 'writing_id'],
            'project_revision_technologies' => ['project_revision_id', 'technology_id'],
            'case_study_revision_technologies' => ['case_study_revision_id', 'technology_id'],
            'experiment_revision_technologies' => ['experiment_revision_id', 'technology_id'],
            'reference_collection_revision_resources' => ['reference_collection_revision_id', 'resource_id'],
            'resume_revision_selected_cases' => ['resume_revision_id', 'case_study_id'],
            'resume_revision_skills' => ['resume_revision_id', 'topic_id'],
            'resume_revision_languages' => ['resume_revision_id', 'language_id'],
        ] as $table => [$revisionColumn, $relatedColumn]) {
            $this->createTable($table, function (Blueprint $blueprint) use ($revisionColumn, $relatedColumn): void {
                $blueprint->unsignedInteger($revisionColumn);
                $blueprint->unsignedInteger($relatedColumn);
                $blueprint->unsignedInteger('sort_order')->default(0);
                if ($revisionColumn === 'reference_collection_revision_id') {
                    $blueprint->text('note')->nullable();
                }
                $blueprint->primary([$revisionColumn, $relatedColumn]);
            });
        }
    }

    private function createProfileRelations(): void
    {
        $this->createTable('profile_revision_interests', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('profile_revision_translation_id');
            $table->text('value');
            $table->unsignedInteger('sort_order')->default(0);
        });

        $this->createTable('profile_revision_trajectory', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('profile_revision_translation_id');
            $table->text('role')->nullable();
            $table->text('organization')->nullable();
            $table->text('period')->nullable();
            $table->boolean('include_in_resume')->default(false);
            $table->boolean('hidden')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
        });

        $this->createTable('profile_revision_trajectory_highlights', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('trajectory_id');
            $table->text('value');
            $table->unsignedInteger('sort_order')->default(0);
        });

        $this->createTable('profile_revision_milestones', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('profile_revision_translation_id');
            $table->string('year')->nullable();
            $table->text('title')->nullable();
            $table->text('description')->nullable();
            $table->boolean('hidden')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
        });

        foreach (['fortunes', 'facts', 'things'] as $kind) {
            $this->createTable('profile_revision_'.$kind, function (Blueprint $table): void {
                $table->increments('id');
                $table->unsignedInteger('profile_revision_translation_id');
                $table->text('value');
                $table->unsignedInteger('sort_order')->default(0);
            });
        }
    }

    private function createResumeRelations(): void
    {
        $definitions = [
            'education' => ['institution', 'location', 'degree', 'period', 'hidden'],
            'leadership' => ['title', 'description', 'period', 'hidden'],
            'certificates' => ['name', 'issuer', 'period', 'url', 'hidden'],
            'certifications' => ['name', 'issuer', 'period', 'url', 'hidden'],
            'publications' => ['title', 'publisher', 'period', 'url', 'description', 'hidden'],
            'recommendations' => ['name', 'role', 'organization', 'text', 'url', 'hidden'],
            'technical_productions' => ['name', 'kind', 'description', 'url', 'period', 'include_in_pdf', 'hidden'],
            'events' => ['name', 'role', 'location', 'period', 'include_in_pdf', 'hidden'],
            'awards' => ['name', 'issuer', 'period', 'url', 'description', 'hidden'],
        ];

        foreach ($definitions as $kind => $columns) {
            $this->createTable('resume_revision_'.$kind, function (Blueprint $table) use ($columns): void {
                $table->increments('id');
                $table->unsignedInteger('resume_revision_translation_id');
                foreach ($columns as $column) {
                    $type = in_array($column, ['hidden', 'include_in_pdf'], true) ? 'boolean' : 'text';
                    $this->addColumn($table, $column, $type);
                }
                $table->unsignedInteger('sort_order')->default(0);
            });
        }
    }

    private function createTable(string $table, Closure $callback): void
    {
        if (! Schema::hasTable($table)) {
            Schema::create($table, $callback);
        }
    }

    private function backfillRevisions(): void
    {
        foreach ($this->revisionDefinitions() as $definition) {
            $this->backfillEntity($definition);
        }

        $this->backfillResourceRelations();
        $this->backfillFeatureRelations();
        $this->backfillProfileRelations();
        $this->backfillResumeRelations();
    }

    private function backfillEntity(array $definition): void
    {
        $source = $definition['identity'];
        $revision = $definition['revision'];
        $identityColumn = $definition['identity_column'];
        $translation = $definition['translation'];
        $translationIdentityColumn = Str::singular($revision).'_id';

        DB::table($source)->orderBy('id')->each(function (object $row) use ($definition, $revision, $identityColumn, $translation, $translationIdentityColumn): void {
            $existing = DB::table($revision)
                ->where($identityColumn, $row->id)
                ->where('revision_number', 1)
                ->first();

            $revisionId = $existing?->id;
            if ($revisionId === null) {
                $data = [
                    $identityColumn => $row->id,
                    'revision_number' => 1,
                    'created_by' => null,
                    'created_at' => $row->created_at ?? now(),
                    'updated_at' => $row->updated_at ?? now(),
                ];

                foreach ($definition['columns'] as $column => $_type) {
                    $data[$column] = property_exists($row, $column) ? $row->{$column} : null;
                }

                $revisionId = DB::table($revision)->insertGetId($data);
            }

            DB::table($definition['identity'])->where('id', $row->id)->update([
                'current_revision_id' => $revisionId,
                'published_revision_id' => $this->isPublic($definition['identity'], $row) ? $revisionId : null,
            ]);

            $translations = DB::table($definition['legacy_translation'])
                ->where($definition['legacy_translation_identity'], $row->id)
                ->orderBy('id')
                ->get();

            foreach ($translations as $legacyTranslation) {
                $translationData = [
                    $translationIdentityColumn => $revisionId,
                    'locale' => $legacyTranslation->locale,
                    'created_at' => $legacyTranslation->created_at ?? now(),
                    'updated_at' => $legacyTranslation->updated_at ?? now(),
                ];

                foreach ($definition['translation_columns'] as $column => $_type) {
                    $translationData[$column] = property_exists($legacyTranslation, $column)
                        ? $legacyTranslation->{$column}
                        : null;
                }

                $newTranslationId = DB::table($translation)
                    ->where($translationIdentityColumn, $revisionId)
                    ->where('locale', $legacyTranslation->locale)
                    ->value('id');

                if ($newTranslationId === null) {
                    $newTranslationId = DB::table($translation)->insertGetId($translationData);
                }

                $this->backfillStructuredTranslation($definition['identity'], $legacyTranslation, $newTranslationId);
            }

            if ($this->isPublic($definition['identity'], $row)) {
                DB::table('content_publications')->insertOrIgnore([
                    'content_type' => $definition['identity'],
                    'content_id' => $row->id,
                    'revision_id' => $revisionId,
                    'published_at' => $row->published_at ?? $row->updated_at ?? now(),
                ]);
            }
        });
    }

    private function backfillStructuredTranslation(string $entity, object $translation, int $translationId): void
    {
        $jsonFields = match ($entity) {
            'resource' => ['seo'],
            'writing' => ['seo'],
            'project' => ['seo', 'metrics'],
            'case_study' => ['seo', 'metrics'],
            'experiment' => ['seo'],
            'reference_collection' => ['seo'],
            'site_settings' => ['seo'],
            default => [],
        };

        foreach ($jsonFields as $field) {
            $value = $this->decode($translation->{$field} ?? null);
            if ($value === []) {
                continue;
            }

            if ($field === 'seo') {
                DB::table('content_revision_seo')->insertOrIgnore([
                    'content_type' => $entity,
                    'translation_id' => $translationId,
                    'title' => $value['title'] ?? null,
                    'description' => $value['description'] ?? null,
                    'canonical_url' => $value['canonical'] ?? ($value['canonical_url'] ?? null),
                    'image_url' => $value['image'] ?? ($value['image_url'] ?? null),
                    'robots' => $value['robots'] ?? null,
                ]);

                continue;
            }

            foreach (array_values($value) as $index => $metric) {
                if (is_array($metric)) {
                    DB::table('content_revision_metrics')->insert([
                        'content_type' => $entity,
                        'translation_id' => $translationId,
                        'name' => (string) ($metric['name'] ?? $metric['label'] ?? $index),
                        'value' => isset($metric['value']) ? (string) $metric['value'] : null,
                        'unit' => isset($metric['unit']) ? (string) $metric['unit'] : null,
                        'sort_order' => $index,
                    ]);
                }
            }
        }
    }

    private function backfillResourceRelations(): void
    {
        DB::table('resources')->orderBy('id')->each(function (object $resource): void {
            $revisionId = DB::table('resources')->where('id', $resource->id)->value('current_revision_id');
            if ($revisionId === null) {
                return;
            }

            foreach (DB::table('resource_links')->where('resource_id', $resource->id)->get() as $link) {
                DB::table('resource_revision_links')->insertOrIgnore([
                    'resource_revision_id' => $revisionId,
                    'url' => $link->url,
                    'label' => $link->label,
                    'platform' => $link->platform,
                    'purpose' => $link->purpose,
                    'is_primary' => $link->is_primary,
                    'is_free' => $link->is_free,
                    'language_id' => $link->language_id,
                    'created_at' => $link->created_at,
                    'updated_at' => $link->updated_at,
                ]);
            }

            foreach (DB::table('resource_identifiers')->where('resource_id', $resource->id)->get() as $identifier) {
                DB::table('resource_revision_identifiers')->insertOrIgnore([
                    'resource_revision_id' => $revisionId,
                    'kind' => $identifier->kind,
                    'value' => $identifier->value,
                    'created_at' => $identifier->created_at,
                    'updated_at' => $identifier->updated_at,
                ]);
            }

            $details = $this->decode($resource->type_details);
            if ($details !== []) {
                DB::table('resource_revision_type_details')->insertOrIgnore([
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
        });
    }

    private function backfillFeatureRelations(): void
    {
        $definitions = [
            'page_featured_case' => ['page', 'pages', 'case_study', 'page_revision_featured_cases', 'page_revision_id', 'case_study_id'],
            'page_featured_project' => ['page', 'pages', 'project', 'page_revision_featured_projects', 'page_revision_id', 'project_id'],
            'page_featured_writing' => ['page', 'pages', 'writing', 'page_revision_featured_writings', 'page_revision_id', 'writing_id'],
            'project_technology' => ['project', 'projects', 'technology', 'project_revision_technologies', 'project_revision_id', 'technology_id'],
            'case_study_technology' => ['case_study', 'case_studies', 'technology', 'case_study_revision_technologies', 'case_study_revision_id', 'technology_id'],
            'experiment_technology' => ['experiment', 'experiments', 'technology', 'experiment_revision_technologies', 'experiment_revision_id', 'technology_id'],
            'resume_selected_case' => ['resume', 'resumes', 'case_study', 'resume_revision_selected_cases', 'resume_revision_id', 'case_study_id'],
            'reference_collection_item' => ['reference_collection', 'reference_collections', 'resource', 'reference_collection_revision_resources', 'reference_collection_revision_id', 'resource_id'],
        ];

        foreach ($definitions as $table => [$left, $leftTable, $right, $target, $revisionColumn, $rightColumn]) {
            DB::table($table)->orderBy($left.'_id')->each(function (object $relation) use ($leftTable, $left, $target, $revisionColumn, $rightColumn, $right): void {
                $revisionId = DB::table($leftTable)->where('id', $relation->{$left.'_id'})->value('current_revision_id');
                if ($revisionId === null) {
                    return;
                }

                $data = [
                    $revisionColumn => $revisionId,
                    $rightColumn => $relation->{$right.'_id'},
                    'sort_order' => $relation->order ?? 0,
                ];

                if ($target === 'reference_collection_revision_resources') {
                    $data['note'] = $relation->note;
                }

                DB::table($target)->insertOrIgnore($data);
            });
        }

        DB::table('topicables')->orderBy('topicable_id')->each(function (object $relation): void {
            if ($relation->topicable_type !== 'resource') {
                return;
            }

            $revisionId = DB::table('resources')->where('id', $relation->topicable_id)->value('current_revision_id');
            if ($revisionId !== null) {
                DB::table('resource_revision_topics')->insertOrIgnore([
                    'resource_revision_id' => $revisionId,
                    'topic_id' => $relation->topic_id,
                    'role' => $relation->role,
                ]);
            }
        });
    }

    private function backfillProfileRelations(): void
    {
        DB::table('profiles')->orderBy('id')->each(function (object $profile): void {
            $revisionId = DB::table('profiles')->where('id', $profile->id)->value('current_revision_id');
            if ($revisionId === null) {
                return;
            }

            foreach (DB::table('profile_translations')->where('profile_id', $profile->id)->get() as $translation) {
                $revisionTranslationId = DB::table('profile_revision_translations')
                    ->where('profile_revision_id', $revisionId)
                    ->where('locale', $translation->locale)
                    ->value('id');

                if ($revisionTranslationId === null) {
                    continue;
                }

                foreach ($this->decode($translation->personal_interests) as $order => $value) {
                    DB::table('profile_revision_interests')->insert([
                        'profile_revision_translation_id' => $revisionTranslationId,
                        'value' => (string) $value,
                        'sort_order' => $order,
                    ]);
                }

                foreach ($this->decode($translation->trajectory) as $order => $value) {
                    $trajectoryId = DB::table('profile_revision_trajectory')->insertGetId([
                        'profile_revision_translation_id' => $revisionTranslationId,
                        'role' => $value['role'] ?? null,
                        'organization' => $value['organization'] ?? null,
                        'period' => $value['period'] ?? null,
                        'include_in_resume' => $value['includeInResume'] ?? false,
                        'hidden' => $value['hidden'] ?? false,
                        'sort_order' => $order,
                    ]);

                    foreach ($value['highlights'] ?? [] as $highlightOrder => $highlight) {
                        DB::table('profile_revision_trajectory_highlights')->insert([
                            'trajectory_id' => $trajectoryId,
                            'value' => (string) $highlight,
                            'sort_order' => $highlightOrder,
                        ]);
                    }
                }

                foreach ($this->decode($translation->milestones) as $order => $value) {
                    DB::table('profile_revision_milestones')->insert([
                        'profile_revision_translation_id' => $revisionTranslationId,
                        'year' => $value['year'] ?? null,
                        'title' => $value['title'] ?? null,
                        'description' => $value['description'] ?? null,
                        'hidden' => $value['hidden'] ?? false,
                        'sort_order' => $order,
                    ]);
                }

                foreach (['fortunes', 'facts', 'things'] as $source => $target) {
                    foreach ($this->decode($translation->{'personal_'.$source} ?? null) as $order => $value) {
                        DB::table('profile_revision_'.$target)->insert([
                            'profile_revision_translation_id' => $revisionTranslationId,
                            'value' => is_scalar($value) ? (string) $value : (string) ($value['value'] ?? ''),
                            'sort_order' => $order,
                        ]);
                    }
                }
            }
        });
    }

    private function backfillResumeRelations(): void
    {
        DB::table('resumes')->orderBy('id')->each(function (object $resume): void {
            $revisionId = DB::table('resumes')->where('id', $resume->id)->value('current_revision_id');
            if ($revisionId === null) {
                return;
            }

            foreach (DB::table('resume_translations')->where('resume_id', $resume->id)->get() as $translation) {
                $revisionTranslationId = DB::table('resume_revision_translations')
                    ->where('resume_revision_id', $revisionId)
                    ->where('locale', $translation->locale)
                    ->value('id');

                if ($revisionTranslationId === null) {
                    continue;
                }

                $fields = [
                    'education' => ['institution', 'location', 'degree', 'period', 'hidden'],
                    'leadership' => ['title', 'description', 'period', 'hidden'],
                    'certificates' => ['name', 'issuer', 'period', 'url', 'hidden'],
                    'certifications' => ['name', 'issuer', 'period', 'url', 'hidden'],
                    'publications' => ['title', 'publisher', 'period', 'url', 'description', 'hidden'],
                    'recommendations' => ['name', 'role', 'organization', 'text', 'url', 'hidden'],
                    'technical_productions' => ['name', 'kind', 'description', 'url', 'period', 'include_in_pdf', 'hidden'],
                    'events' => ['name', 'role', 'location', 'period', 'include_in_pdf', 'hidden'],
                    'awards' => ['name', 'issuer', 'period', 'url', 'description', 'hidden'],
                ];

                foreach ($fields as $field => $columns) {
                    foreach ($this->decode($translation->{$field}) as $order => $value) {
                        $data = [
                            'resume_revision_translation_id' => $revisionTranslationId,
                            'sort_order' => $order,
                        ];

                        foreach ($columns as $column) {
                            $source = str_replace('_', '', ucwords($column, '_'));
                            $camel = lcfirst($source);
                            $data[$column] = $value[$camel] ?? $value[$column] ?? null;
                        }

                        DB::table('resume_revision_'.$field)->insert($data);
                    }
                }
            }
        });
    }

    private function decode(mixed $value): array
    {
        if (! is_string($value) || trim($value) === '') {
            return [];
        }

        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : [];
    }

    private function isPublic(string $table, object $row): bool
    {
        if (property_exists($row, 'hidden') && $row->hidden) {
            return false;
        }

        if ($table === 'resources') {
            return ($row->visibility ?? 'public') === 'public';
        }

        if (property_exists($row, 'nda') && $row->nda) {
            return false;
        }

        return true;
    }

    private function revisionDefinitions(): array
    {
        $pageFields = [
            'activitypub_description', 'activitypub_title', 'ai_body', 'ai_heading', 'api_description', 'api_title',
            'archive_label', 'assistindo', 'atom_description', 'atom_title', 'available_label', 'code_body',
            'code_heading', 'construindo', 'contact', 'contact_description', 'contact_eyebrow', 'contact_title',
            'content_body', 'content_heading', 'context', 'currently_exploring_label', 'description', 'estudando',
            'experience_description', 'experience_eyebrow', 'experience_title', 'experiments_summary',
            'experiments_title', 'eyebrow', 'future_label', 'future_title', 'hero_current_focus', 'hero_experience',
            'hero_identity', 'intro', 'jsonfeed_description', 'jsonfeed_title', 'lead', 'lendo', 'ouvindo',
            'planned_label', 'planned_title', 'projects_description', 'projects_eyebrow', 'projects_title',
            'recurring_technologies_label', 'robots_description', 'robots_title', 'rss_description', 'rss_title',
            'section_label', 'section_title', 'selected_label', 'sitemap_description', 'sitemap_title', 'story',
            'story_eyebrow', 'story_title', 'title', 'trabalhando', 'unavailable_label', 'webfinger_description',
            'webfinger_title', 'webmention_description', 'webmention_title', 'websub_description', 'websub_title',
            'work_description', 'work_eyebrow', 'work_title', 'writing_description', 'writing_eyebrow', 'writing_title',
        ];

        $simple = [
            'writings' => ['identity_column' => 'writing_id', 'revision' => 'writing_revisions', 'translation' => 'writing_revision_translations', 'legacy_translation' => 'writing_translations', 'legacy_translation_identity' => 'writing_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'date_iso' => 'datetime', 'type' => 'string', 'show_history' => 'boolean'], 'translation_columns' => ['title' => 'text', 'excerpt' => 'text', 'reading_time' => 'string', 'body' => 'text']],
            'pages' => ['identity_column' => 'page_id', 'revision' => 'page_revisions', 'translation' => 'page_revision_translations', 'legacy_translation' => 'page_translations', 'legacy_translation_identity' => 'page_id', 'columns' => ['slug' => 'text', 'hidden' => 'boolean'], 'translation_columns' => array_fill_keys($pageFields, 'text')],
            'projects' => ['identity_column' => 'project_id', 'revision' => 'project_revisions', 'translation' => 'project_revision_translations', 'legacy_translation' => 'project_translations', 'legacy_translation_identity' => 'project_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'order' => 'integer', 'href' => 'text', 'external' => 'boolean', 'nda' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'], 'translation_columns' => ['name' => 'text', 'purpose' => 'text', 'problem' => 'text', 'current_focus' => 'text', 'status' => 'text', 'body' => 'text']],
            'case_studies' => ['identity_column' => 'case_study_id', 'revision' => 'case_study_revisions', 'translation' => 'case_study_revision_translations', 'legacy_translation' => 'case_study_translations', 'legacy_translation_identity' => 'case_study_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'order' => 'integer', 'href' => 'text', 'external' => 'boolean', 'visual' => 'text', 'nda' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'], 'translation_columns' => ['title' => 'text', 'status' => 'text', 'meta' => 'text', 'summary' => 'text', 'context' => 'text', 'role' => 'text', 'result' => 'text', 'body' => 'text']],
            'experiments' => ['identity_column' => 'experiment_id', 'revision' => 'experiment_revisions', 'translation' => 'experiment_revision_translations', 'legacy_translation' => 'experiment_translations', 'legacy_translation_identity' => 'experiment_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'order' => 'integer', 'href' => 'text', 'external' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'], 'translation_columns' => ['name' => 'text', 'purpose' => 'text', 'body' => 'text']],
            'reference_collections' => ['identity_column' => 'reference_collection_id', 'revision' => 'reference_collection_revisions', 'translation' => 'reference_collection_revision_translations', 'legacy_translation' => 'reference_collection_translations', 'legacy_translation_identity' => 'reference_collection_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'order' => 'integer', 'image' => 'text', 'published_at' => 'date'], 'translation_columns' => ['title' => 'text', 'description' => 'text', 'intro' => 'text']],
            'snippets' => ['identity_column' => 'snippet_id', 'revision' => 'snippet_revisions', 'translation' => 'snippet_revision_translations', 'legacy_translation' => 'snippet_translations', 'legacy_translation_identity' => 'snippet_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'show_history' => 'boolean', 'order' => 'integer', 'published_at' => 'date'], 'translation_columns' => ['title' => 'text', 'description' => 'text']],
            'technologies' => ['identity_column' => 'technology_id', 'revision' => 'technology_revisions', 'translation' => 'technology_revision_translations', 'legacy_translation' => 'technology_translations', 'legacy_translation_identity' => 'technology_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'order' => 'integer', 'code' => 'text', 'logo' => 'text', 'hidden' => 'boolean'], 'translation_columns' => ['name' => 'text']],
            'topics' => ['identity_column' => 'topic_id', 'revision' => 'topic_revisions', 'translation' => 'topic_revision_translations', 'legacy_translation' => 'topic_translations', 'legacy_translation_identity' => 'topic_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'order' => 'integer', 'kind' => 'string', 'parent_id' => 'integer', 'hidden' => 'boolean'], 'translation_columns' => ['name' => 'text']],
            'profiles' => ['identity_column' => 'profile_id', 'revision' => 'profile_revisions', 'translation' => 'profile_revision_translations', 'legacy_translation' => 'profile_translations', 'legacy_translation_identity' => 'profile_id', 'columns' => ['name' => 'text', 'birth_date' => 'date', 'hidden' => 'boolean'], 'translation_columns' => ['title' => 'text', 'location' => 'text', 'birth_city' => 'text', 'description' => 'text', 'interests' => 'text', 'learning' => 'text']],
            'resumes' => ['identity_column' => 'resume_id', 'revision' => 'resume_revisions', 'translation' => 'resume_revision_translations', 'legacy_translation' => 'resume_translations', 'legacy_translation_identity' => 'resume_id', 'columns' => ['hidden' => 'boolean'], 'translation_columns' => ['summary' => 'text']],
            'site_settings' => ['identity_column' => 'site_settings_id', 'revision' => 'site_settings_revisions', 'translation' => 'site_settings_revision_translations', 'legacy_translation' => 'site_settings_translations', 'legacy_translation_identity' => 'site_settings_id', 'columns' => ['short_name' => 'text', 'portfolio_url' => 'text', 'maintenance_enabled' => 'boolean', 'contact_email' => 'text', 'contact_available' => 'boolean', 'source_repository_url' => 'text'], 'translation_columns' => ['copyright_template' => 'text', 'maintenance_eyebrow' => 'text', 'maintenance_title' => 'text', 'maintenance_description' => 'text']],
            'nav_items' => ['identity_column' => 'nav_item_id', 'revision' => 'nav_item_revisions', 'translation' => 'nav_item_revision_translations', 'legacy_translation' => 'nav_item_translations', 'legacy_translation_identity' => 'nav_item_id', 'columns' => ['route_name' => 'text', 'parent_id' => 'integer', 'placement' => 'text', 'sidebar_group' => 'integer', 'order' => 'integer'], 'translation_columns' => ['label' => 'text']],
            'credit_entries' => ['identity_column' => 'credit_entry_id', 'revision' => 'credit_entry_revisions', 'translation' => 'credit_entry_revision_translations', 'legacy_translation' => 'credit_entry_translations', 'legacy_translation_identity' => 'credit_entry_id', 'columns' => ['url' => 'text', 'category' => 'text', 'order' => 'integer', 'is_automatic' => 'boolean', 'active' => 'boolean', 'package_manager' => 'text', 'package_name' => 'text'], 'translation_columns' => ['name' => 'text', 'description' => 'text']],
        ];

        $resource = ['identity_column' => 'resource_id', 'revision' => 'resource_revisions', 'translation' => 'resource_revision_translations', 'legacy_translation' => 'resource_translations', 'legacy_translation_identity' => 'resource_id', 'columns' => ['slug' => 'text', 'public_id' => 'string:6', 'hidden' => 'boolean', 'order' => 'integer', 'type' => 'string', 'language_id' => 'integer', 'published_date_iso' => 'date', 'found_date_iso' => 'date', 'consumption_state' => 'string', 'rating' => 'string', 'editorial_state' => 'string', 'visibility' => 'string', 'featured' => 'boolean', 'featured_order' => 'integer', 'popularity_kind' => 'string', 'popularity_rank' => 'double', 'popularity_refreshed_at' => 'datetime', 'popularity_value' => 'bigInteger'], 'translation_columns' => ['title' => 'text', 'alternative_title' => 'text', 'description' => 'text', 'personal_note' => 'text', 'reason_found' => 'text']];

        $definitions = array_merge(['resources' => $resource], $simple);

        foreach ($definitions as $identity => &$definition) {
            $definition['identity'] = $identity;
        }

        unset($definition);

        return $definitions;
    }
};
