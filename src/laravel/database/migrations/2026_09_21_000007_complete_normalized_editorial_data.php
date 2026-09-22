<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->extendSeo();
        $this->extendProfileThings();
        $this->createLanguageRevisions();
        $this->backfillSeo();
        $this->backfillProfileThings();
    }

    public function down(): void
    {
        Schema::dropIfExists('language_revision_translations');
        Schema::dropIfExists('language_revisions');

        if (Schema::hasColumn('languages', 'current_revision_id')) {
            Schema::table('languages', function (Blueprint $table): void {
                $table->dropColumn(['current_revision_id', 'published_revision_id']);
            });
        }

        Schema::dropIfExists('content_revision_seo_keywords');

        if (Schema::hasTable('content_revision_seo')) {
            Schema::table('content_revision_seo', function (Blueprint $table): void {
                $table->dropColumn(['image_alt', 'no_index']);
            });
        }

        if (Schema::hasColumn('profile_revision_things', 'label')) {
            Schema::table('profile_revision_things', function (Blueprint $table): void {
                $table->dropColumn(['label', 'since']);
            });
        }
    }

    private function extendSeo(): void
    {
        Schema::table('content_revision_seo', function (Blueprint $table): void {
            if (! Schema::hasColumn('content_revision_seo', 'image_alt')) {
                $table->text('image_alt')->nullable();
            }
            if (! Schema::hasColumn('content_revision_seo', 'no_index')) {
                $table->boolean('no_index')->default(false);
            }
        });

        if (! Schema::hasTable('content_revision_seo_keywords')) {
            Schema::create('content_revision_seo_keywords', function (Blueprint $table): void {
                $table->increments('id');
                $table->string('content_type', 80);
                $table->unsignedInteger('translation_id');
                $table->text('keyword');
                $table->unsignedInteger('sort_order')->default(0);
                $table->unique(['content_type', 'translation_id', 'keyword']);
                $table->index(['content_type', 'translation_id', 'sort_order']);
            });
        }
    }

    private function extendProfileThings(): void
    {
        Schema::table('profile_revision_things', function (Blueprint $table): void {
            if (! Schema::hasColumn('profile_revision_things', 'label')) {
                $table->text('label')->nullable();
            }
            if (! Schema::hasColumn('profile_revision_things', 'since')) {
                $table->text('since')->nullable();
            }
        });
    }

    private function createLanguageRevisions(): void
    {
        if (! Schema::hasColumn('languages', 'current_revision_id')) {
            Schema::table('languages', function (Blueprint $table): void {
                $table->unsignedInteger('current_revision_id')->nullable();
                $table->unsignedInteger('published_revision_id')->nullable();
            });
        }

        if (! Schema::hasTable('language_revisions')) {
            Schema::create('language_revisions', function (Blueprint $table): void {
                $table->increments('id');
                $table->unsignedInteger('language_id');
                $table->unsignedInteger('revision_number');
                $table->string('slug')->nullable();
                $table->integer('order')->nullable();
                $table->string('code')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->timestamps();
                $table->unique(['language_id', 'revision_number']);
                $table->index(['language_id', 'id']);
            });
        }

        if (! Schema::hasTable('language_revision_translations')) {
            Schema::create('language_revision_translations', function (Blueprint $table): void {
                $table->increments('id');
                $table->unsignedInteger('language_revision_id');
                $table->string('locale', 16);
                $table->text('name')->nullable();
                $table->timestamps();
                $table->unique(['language_revision_id', 'locale']);
            });
        }

        DB::table('languages')->orderBy('id')->each(function (object $language): void {
            $revisionId = DB::table('language_revisions')
                ->where('language_id', $language->id)
                ->where('revision_number', 1)
                ->value('id');

            if ($revisionId === null) {
                $revisionId = DB::table('language_revisions')->insertGetId([
                    'language_id' => $language->id,
                    'revision_number' => 1,
                    'slug' => $language->slug,
                    'order' => $language->order,
                    'code' => $language->code,
                    'created_at' => $language->created_at ?? now(),
                    'updated_at' => $language->updated_at ?? now(),
                ]);
            }

            DB::table('languages')->where('id', $language->id)->update([
                'current_revision_id' => $revisionId,
                'published_revision_id' => $revisionId,
            ]);

            foreach (DB::table('language_translations')->where('language_id', $language->id)->get() as $translation) {
                DB::table('language_revision_translations')->updateOrInsert(
                    ['language_revision_id' => $revisionId, 'locale' => $translation->locale],
                    ['name' => $translation->name, 'created_at' => $translation->created_at ?? now(), 'updated_at' => $translation->updated_at ?? now()],
                );
            }
        });
    }

    private function backfillSeo(): void
    {
        $definitions = [
            'resources' => ['translations' => 'resource_translations', 'identity' => 'resource_id', 'type' => 'resource'],
            'writings' => ['translations' => 'writing_translations', 'identity' => 'writing_id', 'type' => 'writing'],
            'projects' => ['translations' => 'project_translations', 'identity' => 'project_id', 'type' => 'project'],
            'case_studies' => ['translations' => 'case_study_translations', 'identity' => 'case_study_id', 'type' => 'case_study'],
            'experiments' => ['translations' => 'experiment_translations', 'identity' => 'experiment_id', 'type' => 'experiment'],
            'reference_collections' => ['translations' => 'reference_collection_translations', 'identity' => 'reference_collection_id', 'type' => 'reference_collection'],
            'site_settings' => ['translations' => 'site_settings_translations', 'identity' => 'site_settings_id', 'type' => 'site_settings'],
        ];

        foreach ($definitions as $definition) {
            DB::table($definition['translations'])->orderBy('id')->each(function (object $legacy) use ($definition): void {
                $normalized = DB::table($definition['type'] === 'case_study' ? 'case_study_revision_translations' : str_replace('_translations', '_revision_translations', $definition['translations']))
                    ->where('locale', $legacy->locale)
                    ->whereIn(str_replace('_translations', '_revision_id', $definition['translations']), function ($query) use ($definition, $legacy): void {
                        $query->select('id')->from(str_replace('_translations', '_revisions', $definition['translations']))->where($definition['identity'], $legacy->{$definition['identity']})->where('revision_number', 1);
                    })
                    ->first();

                if ($normalized === null) {
                    return;
                }

                $seo = $this->decode($legacy->seo ?? null);
                if ($seo === []) {
                    return;
                }

                DB::table('content_revision_seo')->updateOrInsert(
                    ['content_type' => $definition['type'], 'translation_id' => $normalized->id],
                    [
                        'title' => $seo['title'] ?? null,
                        'description' => $seo['description'] ?? null,
                        'canonical_url' => $seo['canonical'] ?? ($seo['canonical_url'] ?? null),
                        'image_url' => $seo['image'] ?? ($seo['image_url'] ?? null),
                        'image_alt' => $seo['imageAlt'] ?? ($seo['image_alt'] ?? null),
                        'robots' => $seo['robots'] ?? null,
                        'no_index' => $seo['noIndex'] ?? ($seo['no_index'] ?? false),
                    ],
                );

                foreach ($seo['keywords'] ?? [] as $order => $keyword) {
                    DB::table('content_revision_seo_keywords')->insertOrIgnore([
                        'content_type' => $definition['type'],
                        'translation_id' => $normalized->id,
                        'keyword' => (string) $keyword,
                        'sort_order' => $order,
                    ]);
                }
            });
        }
    }

    private function backfillProfileThings(): void
    {
        DB::table('profile_translations')->orderBy('id')->each(function (object $legacy): void {
            $revisionTranslationId = DB::table('profile_revision_translations')
                ->where('locale', $legacy->locale)
                ->whereIn('profile_revision_id', function ($query) use ($legacy): void {
                    $query->select('id')->from('profile_revisions')->where('profile_id', $legacy->profile_id)->where('revision_number', 1);
                })
                ->value('id');

            if ($revisionTranslationId === null) {
                return;
            }

            foreach ($this->decode($legacy->personal_things ?? null) as $order => $value) {
                $item = is_array($value) ? $value : ['label' => (string) $value];
                DB::table('profile_revision_things')
                    ->where('profile_revision_translation_id', $revisionTranslationId)
                    ->where('sort_order', $order)
                    ->update([
                        'label' => $item['label'] ?? null,
                        'since' => $item['since'] ?? null,
                        'value' => $item['label'] ?? ($item['value'] ?? ''),
                    ]);
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
};
