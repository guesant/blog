<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\ContentRelation;
use App\Models\CreditEntry;
use App\Models\Experiment;
use App\Models\Language;
use App\Models\Page;
use App\Models\Profile;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\Resume;
use App\Models\SiteSettings;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\TopicTranslation;
use App\Models\Writing;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

#[Signature('portfolio:import-legacy {--dry-run}')]
#[Description('Import legacy content from JSON snapshot into database')]
class ImportLegacyContent extends Command
{
    private array $created = [];

    private array $updated = [];

    private array $warnings = [];

    private function importRelationTypes(): void
    {
        $path = '/migration-snapshot/relationTypes.json';

        if (! File::exists($path)) {
            $this->warn('relationTypes.json not found, skipping');

            return;
        }

        $data = json_decode(File::get($path), true);

        if (! isset($data['definitions']) || ! is_array($data['definitions'])) {
            $this->warn('Invalid relationTypes.json format');

            return;
        }

        foreach ($data['definitions'] as $id => $definition) {
            RelationType::updateOrCreate(
                ['key' => $id],
                [
                    'key' => $id,
                    'family' => $definition['family'] ?? '',
                    'symmetric' => $definition['symmetric'] ?? false,
                    'outbound_label_en' => $definition['outboundLabel']['en'] ?? '',
                    'outbound_label_pt_br' => $definition['outboundLabel']['ptBR'] ?? '',
                    'inbound_label_en' => $definition['inboundLabel']['en'] ?? '',
                    'inbound_label_pt_br' => $definition['inboundLabel']['ptBR'] ?? '',
                ]
            );
        }
    }

    public function handle()
    {
        DB::beginTransaction();

        try {
            $this->info('Starting import process...');

            $this->line('1. Seeding relation types...');
            $this->importRelationTypes();

            $this->line('2. Importing base lookup tables (technologies, languages)...');
            $this->importSimpleTable('technologies', 'Technology');
            $this->importSimpleTable('languages', 'Language');

            $this->line('3. Importing topics (pass 1: legacy tags, subject categories, snapshot topics)...');
            $this->importTagsAsTopics();
            $this->importSubjectCategoriesAsTopics();
            $this->importTopicsPass1();

            $this->line('4. Importing topics (pass 2: setting parent_id)...');
            $this->importTopicsPass2();

            $this->line('5. Importing case studies, projects, experiments...');
            $this->importTechLinkedCollection('cases', CaseStudy::class, 'case_study');
            $this->importTechLinkedCollection('projects', Project::class, 'project');
            $this->importTechLinkedCollection('experiments', Experiment::class, 'experiment');

            $this->line('6. Importing writings...');
            $this->importWritings();

            $this->line('7. Importing resources (incl. links, identifiers, topics pivot)...');
            $this->importResources();

            $this->line('8. Importing reference collections...');
            $this->importReferenceCollections();

            $this->line('9. Importing content relations...');
            $this->importContentRelations();

            $this->line('10. Importing profile...');
            $this->importProfile();

            $this->line('11. Importing resume...');
            $this->importResume();

            $this->line('12. Importing credit entries...');
            $this->importCreditEntries();

            $this->line('13. Importing site settings...');
            $this->importSiteSettings();

            $this->line('14. Importing pages...');
            $this->importPages();

            $this->printSummary();

            if ($this->option('dry-run')) {
                $this->info('DRY RUN — Rolling back changes...');
                DB::rollBack();
            } else {
                DB::commit();
                $this->info('Import completed successfully!');
            }

            return 0;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('Import failed: '.$e->getMessage());
            $this->error($e->getTraceAsString());

            return 1;
        }
    }

    private function bumpCounter(string $key, bool $wasRecentlyCreated): void
    {
        if ($wasRecentlyCreated) {
            $this->created[$key] = ($this->created[$key] ?? 0) + 1;
        } else {
            $this->updated[$key] = ($this->updated[$key] ?? 0) + 1;
        }
    }

    private function importSimpleTable(string $filename, string $modelClass): void
    {
        $path = "/migration-snapshot/{$filename}.json";
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            $this->warn("Invalid JSON in {$filename}");

            return;
        }

        $modelFull = "App\\Models\\{$modelClass}";
        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $model = $modelFull::updateOrCreate(
                ['slug' => $slug],
                [
                    'slug' => $slug,
                    'order' => $item['order'] ?? 0,
                    'code' => $item['code'] ?? null,
                    'logo' => $item['logo'] ?? null,
                    'kind' => $item['kind'] ?? null,
                ]
            );

            $this->bumpCounter(strtolower(class_basename($modelClass)), $model->wasRecentlyCreated);

            $this->importTranslations($filename, $model, $item);
        }
    }

    private function importTranslations(string $filename, $model, array $item): void
    {
        $translations = $item['translations'] ?? [];
        $modelClass = class_basename($model);
        $translationClass = "App\\Models\\{$modelClass}Translation";

        foreach ($translations as $locale => $translation) {
            $dbLocale = $locale === 'ptBR' ? 'pt-BR' : 'en';
            $data = ['locale' => $dbLocale];

            foreach ($translation as $key => $value) {
                $snakeKey = $this->camelToSnake($key);
                $data[$snakeKey] = $value;
            }

            $translationClass::updateOrCreate(
                ["{$this->camelToSnake($modelClass)}_id" => $model->id, 'locale' => $dbLocale],
                $data
            );
        }
    }

    private function importTagsAsTopics(): void
    {
        $path = '/migration-snapshot/tags.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            $this->warn('Invalid JSON in tags');

            return;
        }

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $this->importLegacyTopic($slug, $item);
        }
    }

    private function importSubjectCategoriesAsTopics(): void
    {
        $path = '/migration-snapshot/categories.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            $this->warn('Invalid JSON in categories');

            return;
        }

        foreach ($data as $item) {
            if (($item['kind'] ?? null) !== 'writing-subject') {
                continue;
            }

            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $this->importLegacyTopic($slug, $item);
        }
    }

    private function importLegacyTopic(string $slug, array $item): void
    {
        $topic = Topic::firstOrCreate(
            ['slug' => $slug],
            [
                'slug' => $slug,
                'order' => $item['order'] ?? 0,
                'kind' => 'topic',
            ]
        );

        $this->bumpCounter('topic', $topic->wasRecentlyCreated);

        foreach ($item['translations'] ?? [] as $locale => $translation) {
            $dbLocale = $locale === 'ptBR' ? 'pt-BR' : 'en';

            $alreadyTranslated = TopicTranslation::where('topic_id', $topic->id)
                ->where('locale', $dbLocale)
                ->exists();

            if ($alreadyTranslated) {
                continue;
            }

            TopicTranslation::create([
                'topic_id' => $topic->id,
                'locale' => $dbLocale,
                'name' => $translation['name'] ?? null,
            ]);
        }
    }

    private function importTopicsPass1(): void
    {
        $path = '/migration-snapshot/topics.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            $this->warn('Invalid JSON in topics.json');

            return;
        }

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $topic = Topic::updateOrCreate(
                ['slug' => $slug],
                [
                    'slug' => $slug,
                    'order' => $item['order'] ?? 0,
                    'kind' => $item['kind'] ?? null,
                ]
            );

            $this->bumpCounter('topic', $topic->wasRecentlyCreated);

            $this->importTranslations('topics', $topic, $item);
        }
    }

    private function importTopicsPass2(): void
    {
        $path = '/migration-snapshot/topics.json';
        if (! File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $topic = Topic::where('slug', $slug)->first();
            if (! $topic) {
                continue;
            }

            $parentSlug = $item['parentSlug'] ?? null;
            if ($parentSlug) {
                $parent = Topic::where('slug', $parentSlug)->first();
                if ($parent) {
                    $topic->update(['parent_id' => $parent->id]);
                } else {
                    $this->warnings[] = "topics: parent slug '{$parentSlug}' not found for topic '{$slug}'";
                }
            }
        }
    }

    /**
     * Shared shape of cases.json / projects.json / experiments.json: a slug,
     * hidden/order/href/external, translations, and a technologies pivot.
     *
     * @param  class-string<CaseStudy|Project|Experiment>  $modelClass
     */
    private function importTechLinkedCollection(string $slug, string $modelClass, string $countKey): void
    {
        $path = "/migration-snapshot/{$slug}.json";
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $techMap = $this->buildSlugIdMap(Technology::class);

        foreach ($data as $item) {
            $itemSlug = $item['slug'] ?? null;
            if (! $itemSlug) {
                continue;
            }

            $model = $modelClass::updateOrCreate(
                ['slug' => $itemSlug],
                [
                    'slug' => $itemSlug,
                    'hidden' => $item['hidden'] ?? false,
                    'order' => $item['order'] ?? 0,
                    'href' => $item['href'] ?? null,
                    'external' => $item['external'] ?? false,
                ]
            );

            $this->bumpCounter($countKey, $model->wasRecentlyCreated);

            $this->importTranslations($slug, $model, $item);

            $techIds = array_values(array_filter(array_map(fn ($s) => $techMap[$s] ?? null, $item['technologySlugs'] ?? [])));
            $model->technologies()->sync(
                collect($techIds)->mapWithKeys(fn ($id, $index) => [$id => ['order' => $index]])
            );
        }
    }

    private function importWritings(): void
    {
        $path = '/migration-snapshot/writing.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $topicMap = $this->buildSlugIdMap(Topic::class);

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $writing = Writing::updateOrCreate(
                ['slug' => $slug],
                [
                    'slug' => $slug,
                    'hidden' => $item['hidden'] ?? false,
                    'date_iso' => ($item['dateISO'] ?? null) ?: null,
                    'type' => $item['typeCategorySlug'] ?? null,
                ]
            );

            $this->bumpCounter('writing', $writing->wasRecentlyCreated);

            $this->importTranslations('writing', $writing, $item);

            $topicSlugs = array_filter(array_merge(
                [$item['subjectCategorySlug'] ?? null],
                $item['tagSlugs'] ?? []
            ));

            $topicIds = [];
            foreach ($topicSlugs as $topicSlug) {
                if (isset($topicMap[$topicSlug])) {
                    $topicIds[] = $topicMap[$topicSlug];
                } else {
                    $this->warnings[] = "writing: topic slug '{$topicSlug}' not found for writing '{$slug}'";
                }
            }

            $writing->topics()->syncWithoutDetaching(array_unique($topicIds));
        }
    }

    private function importResources(): void
    {
        $path = '/migration-snapshot/references.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $langMap = $this->buildSlugIdMap(Language::class);
        $topicMap = $this->buildSlugIdMap(Topic::class);

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $languageId = null;
            if ($langSlug = $item['languageSlug'] ?? null) {
                $languageId = $langMap[$langSlug] ?? null;
            }

            $typeDetails = null;
            foreach (['book', 'paper', 'repo', 'video', 'film'] as $type) {
                if ($item[$type] ?? null) {
                    $typeDetails = $item[$type];
                    break;
                }
            }

            $resource = Resource::updateOrCreate(
                ['slug' => $slug],
                [
                    'slug' => $slug,
                    'hidden' => $item['hidden'] ?? false,
                    'order' => $item['order'] ?? 0,
                    'type' => $item['type'] ?? null,
                    'language_id' => $languageId,
                    'authors' => $item['authors'] ?? null,
                    'organizations' => $item['organizations'] ?? null,
                    'published_date_iso' => ($item['publishedDateISO'] ?? null) ?: null,
                    'found_date_iso' => ($item['foundDateISO'] ?? null) ?: null,
                    'consumption_state' => $item['consumptionState'] ?? null,
                    'rating' => $item['rating'] ?? null,
                    'editorial_state' => $item['editorialState'] ?? null,
                    'visibility' => $item['visibility'] ?? null,
                    'type_details' => $typeDetails,
                ]
            );

            $this->bumpCounter('resource', $resource->wasRecentlyCreated);

            $this->importTranslations('references', $resource, $item);

            $this->importResourceLinks($resource, $item);
            $this->importResourceIdentifiers($resource, $item);
            $this->importResourceTopics($resource, $item, $topicMap);
        }
    }

    private function importResourceLinks(Resource $resource, array $item): void
    {
        $resource->links()->delete();

        foreach ($item['links'] ?? [] as $link) {
            $langMap = $this->buildSlugIdMap(Language::class);
            $languageId = null;
            if ($langSlug = $link['languageSlug'] ?? null) {
                $languageId = $langMap[$langSlug] ?? null;
            }

            $resource->links()->create([
                'url' => $link['url'] ?? null,
                'label' => $link['label'] ?? null,
                'platform' => $link['platform'] ?? null,
                'purpose' => $link['purpose'] ?? null,
                'is_primary' => $link['isPrimary'] ?? false,
                'is_free' => $link['isFree'] ?? false,
                'language_id' => $languageId,
            ]);
        }
    }

    private function importResourceIdentifiers(Resource $resource, array $item): void
    {
        $resource->identifiers()->delete();

        foreach ($item['identifiers'] ?? [] as $identifier) {
            $resource->identifiers()->create([
                'kind' => $identifier['kind'] ?? null,
                'value' => $identifier['value'] ?? null,
            ]);
        }
    }

    private function importResourceTopics(Resource $resource, array $item, array $topicMap): void
    {
        $sync = [];
        foreach ($item['topics'] ?? [] as $topic) {
            $slug = $topic['slug'] ?? null;
            if (! $slug || ! isset($topicMap[$slug])) {
                $this->warnings[] = "references: topic slug '{$slug}' not found for resource '{$item['slug']}'";

                continue;
            }
            $sync[$topicMap[$slug]] = ['role' => $topic['role'] ?? null];
        }
        $resource->topics()->sync($sync);
    }

    private function importReferenceCollections(): void
    {
        $path = '/migration-snapshot/collections.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $resourceMap = $this->buildSlugIdMap(Resource::class);

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $collection = ReferenceCollection::updateOrCreate(
                ['slug' => $slug],
                [
                    'slug' => $slug,
                    'hidden' => $item['hidden'] ?? false,
                    'order' => $item['order'] ?? 0,
                    'image' => $item['image'] ?? null,
                ]
            );

            $this->bumpCounter('reference_collection', $collection->wasRecentlyCreated);

            $this->importTranslations('collections', $collection, $item);

            $sync = [];
            foreach ($item['items'] ?? [] as $index => $itemEntry) {
                $resourceSlug = $itemEntry['slug'] ?? null;
                if (! $resourceSlug || ! isset($resourceMap[$resourceSlug])) {
                    $this->warnings[] = "collections: resource slug '{$resourceSlug}' not found for collection '{$slug}'";

                    continue;
                }

                $sync[$resourceMap[$resourceSlug]] = [
                    'note' => $itemEntry['note'] ?? null,
                    'order' => $index,
                ];
            }
            $collection->resources()->sync($sync);
        }
    }

    private function importContentRelations(): void
    {
        $this->importContentRelationsFor('references', Resource::class, 'resource');
        $this->importContentRelationsFor('topics', Topic::class, 'topic');
    }

    /**
     * Shared "re-derive a subject's outbound content relations from its
     * snapshot file" logic: wipe existing relations for the subject, then
     * recreate one per relation entry, resolving the relation type and
     * target by slug.
     *
     * @param  class-string<resource|Topic>  $modelClass
     */
    private function importContentRelationsFor(string $filePrefix, string $modelClass, string $noun): void
    {
        $path = "/migration-snapshot/{$filePrefix}.json";
        if (! File::exists($path)) {
            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $targetMap = $this->buildSlugIdMap($modelClass);
        $morphClass = (new $modelClass)->getMorphClass();

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $subject = $modelClass::where('slug', $slug)->first();
            if (! $subject) {
                continue;
            }

            ContentRelation::where('subject_type', $morphClass)
                ->where('subject_id', $subject->id)
                ->delete();

            foreach ($item['relations'] ?? [] as $relation) {
                $relationType = RelationType::where('key', $relation['relationType'] ?? null)->first();
                if (! $relationType) {
                    $this->warnings[] = "{$filePrefix}: relation type '{$relation['relationType']}' not found for {$noun} '{$slug}'";

                    continue;
                }

                $targetSlug = $relation['targetSlug'] ?? null;
                $targetId = $targetMap[$targetSlug] ?? null;
                if (! $targetId) {
                    $this->warnings[] = "{$filePrefix}: target {$noun} slug '{$targetSlug}' not found for relation in '{$slug}'";

                    continue;
                }

                ContentRelation::create([
                    'relation_type_id' => $relationType->id,
                    'subject_type' => $morphClass,
                    'subject_id' => $subject->id,
                    'object_type' => $morphClass,
                    'object_id' => $targetId,
                    'note' => $relation['note'] ?? null,
                    'context' => $relation['context'] ?? null,
                    'status' => $relation['status'] ?? null,
                    'visibility' => $relation['visibility'] ?? null,
                ]);
            }
        }
    }

    private function importProfile(): void
    {
        $path = '/migration-snapshot/profile.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $profile = Profile::first() ?? new Profile;
        $profile->name = $data['name'] ?? null;
        $profile->birth_date = ($data['birthDate'] ?? null) ?: null;
        $profile->save();

        $this->bumpCounter('profile', $profile->wasRecentlyCreated);

        $this->importTranslations('profile', $profile, $data);
    }

    private function importResume(): void
    {
        $path = '/migration-snapshot/resume.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $resume = Resume::first() ?? new Resume;
        $resume->save();

        $this->bumpCounter('resume', $resume->wasRecentlyCreated);

        $this->importTranslations('resume', $resume, $data);

        $this->importResumeSelectedCases($resume, $data);
        $this->importResumeSkills($resume, $data);
        $this->importResumeLanguages($resume, $data);
    }

    private function importResumeSelectedCases(Resume $resume, array $data): void
    {
        $caseMap = $this->buildSlugIdMap(CaseStudy::class);
        $sync = [];
        foreach ($data['selectedCaseSlugs'] ?? [] as $index => $slug) {
            if (isset($caseMap[$slug])) {
                $sync[$caseMap[$slug]] = ['order' => $index];
            } else {
                $this->warnings[] = "resume: case slug '{$slug}' not found";
            }
        }
        $resume->selectedCases()->sync($sync);
    }

    private function importResumeSkills(Resume $resume, array $data): void
    {
        $resume->skills()->delete();

        $topicMap = $this->buildSlugIdMap(Topic::class);
        $techMap = $this->buildSlugIdMap(Technology::class);

        foreach ($data['skills'] ?? [] as $index => $skill) {
            $categorySlug = $skill['categorySlug'] ?? null;
            $topicId = $topicMap[$categorySlug] ?? null;

            if (! $topicId) {
                $this->warnings[] = "resume.skills: category slug '{$categorySlug}' not found, skipping this skill entry";

                continue;
            }

            $resumeSkill = $resume->skills()->create([
                'topic_id' => $topicId,
                'order' => $index,
            ]);

            $techIds = array_filter(array_map(fn ($s) => $techMap[$s] ?? null, $skill['technologySlugs'] ?? []));
            $resumeSkill->technologies()->sync($techIds);
        }
    }

    private function importResumeLanguages(Resume $resume, array $data): void
    {
        $resume->languages()->delete();

        $langMap = $this->buildSlugIdMap(Language::class);

        foreach ($data['languages'] ?? [] as $index => $language) {
            $languageSlug = $language['languageSlug'] ?? null;
            $languageId = $langMap[$languageSlug] ?? null;

            if (! $languageId) {
                $this->warnings[] = "resume: language slug '{$languageSlug}' not found";

                continue;
            }

            $resume->languages()->create([
                'language_id' => $languageId,
                'proficiency' => $language['proficiency'] ?? null,
                'order' => $index,
            ]);
        }
    }

    private function importCreditEntries(): void
    {
        $path = '/migration-snapshot/credits.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        CreditEntry::query()->delete();

        foreach ($data['entries'] ?? [] as $index => $entry) {
            $creditEntry = CreditEntry::create([
                'url' => $entry['url'] ?? null,
                'category' => $entry['category'] ?? null,
                'order' => $index,
            ]);

            $translations = $entry['translations'] ?? [];
            foreach ($translations as $locale => $translation) {
                $dbLocale = $locale === 'ptBR' ? 'pt-BR' : 'en';
                $creditEntry->translations()->create([
                    'locale' => $dbLocale,
                    'name' => $translation['name'] ?? null,
                    'description' => $translation['description'] ?? null,
                ]);
            }

            $this->created['credit_entry'] = ($this->created['credit_entry'] ?? 0) + 1;
        }
    }

    private function importSiteSettings(): void
    {
        $path = '/migration-snapshot/settings.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $settings = SiteSettings::first() ?? new SiteSettings;
        $settings->short_name = $data['shortName'] ?? null;
        $settings->portfolio_url = $data['portfolioUrl'] ?? null;
        $settings->maintenance_enabled = $data['maintenanceEnabled'] ?? false;
        $settings->contact_email = $data['contact']['email'] ?? null;
        $settings->contact_available = $data['contact']['available'] ?? false;
        $settings->save();

        $this->bumpCounter('site_settings', $settings->wasRecentlyCreated);

        $this->importSiteSettingsTranslations($settings, $data);
        $this->importContactProfiles($settings, $data);
    }

    private function importSiteSettingsTranslations(SiteSettings $settings, array $data): void
    {
        $translations = $data['translations'] ?? [];

        foreach ($translations as $locale => $translation) {
            $dbLocale = $locale === 'ptBR' ? 'pt-BR' : 'en';

            $maintenance = $translation['maintenance'] ?? [];
            $seo = $translation['seo'] ?? null;

            $settings->translations()->updateOrCreate(
                ['locale' => $dbLocale],
                [
                    'locale' => $dbLocale,
                    'copyright_template' => $translation['copyrightTemplate'] ?? null,
                    'maintenance_eyebrow' => $maintenance['eyebrow'] ?? null,
                    'maintenance_title' => $maintenance['title'] ?? null,
                    'maintenance_description' => $maintenance['description'] ?? null,
                    'seo' => $seo,
                ]
            );
        }
    }

    private function importContactProfiles(SiteSettings $settings, array $data): void
    {
        $settings->contactProfiles()->delete();

        foreach ($data['contact']['profiles'] ?? [] as $index => $profile) {
            $settings->contactProfiles()->create([
                'platform' => $profile['platform'] ?? null,
                'label' => $profile['label'] ?? null,
                'url' => $profile['url'] ?? null,
                'order' => $index,
            ]);
        }
    }

    private function importPages(): void
    {
        $path = '/migration-snapshot/pages.json';
        if (! File::exists($path)) {
            $this->warn("File not found: {$path}");

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            return;
        }

        $caseMap = $this->buildSlugIdMap(CaseStudy::class);
        $projectMap = $this->buildSlugIdMap(Project::class);
        $writingMap = $this->buildSlugIdMap(Writing::class);

        foreach ($data as $item) {
            $slug = $item['slug'] ?? null;
            if (! $slug) {
                continue;
            }

            $page = Page::updateOrCreate(
                ['slug' => $slug],
                ['slug' => $slug]
            );

            $this->bumpCounter('page', $page->wasRecentlyCreated);

            $this->importPageTranslations($page, $item);
            $this->importPageFeaturedCases($page, $item, $caseMap);
            $this->importPageFeaturedProjects($page, $item, $projectMap);
            $this->importPageFeaturedWritings($page, $item, $writingMap);
        }
    }

    private function importPageTranslations(Page $page, array $item): void
    {
        $translations = $item['translations'] ?? [];

        foreach ($translations as $locale => $translation) {
            $dbLocale = $locale === 'ptBR' ? 'pt-BR' : 'en';

            $page->translations()->updateOrCreate(
                ['locale' => $dbLocale],
                [
                    'locale' => $dbLocale,
                    'fields' => $translation,
                ]
            );
        }
    }

    private function importPageFeaturedCases(Page $page, array $item, array $caseMap): void
    {
        $sync = [];
        foreach ($item['featuredCasesSlugs'] ?? [] as $index => $slug) {
            if (isset($caseMap[$slug])) {
                $sync[$caseMap[$slug]] = ['order' => $index];
            } else {
                $this->warnings[] = "pages: case slug '{$slug}' not found for page '{$item['slug']}'";
            }
        }
        $page->featuredCases()->sync($sync);
    }

    private function importPageFeaturedProjects(Page $page, array $item, array $projectMap): void
    {
        $sync = [];
        foreach ($item['featuredProjectsSlugs'] ?? [] as $index => $slug) {
            if (isset($projectMap[$slug])) {
                $sync[$projectMap[$slug]] = ['order' => $index];
            } else {
                $this->warnings[] = "pages: project slug '{$slug}' not found for page '{$item['slug']}'";
            }
        }
        $page->featuredProjects()->sync($sync);
    }

    private function importPageFeaturedWritings(Page $page, array $item, array $writingMap): void
    {
        $sync = [];
        foreach ($item['featuredWritingSlugs'] ?? [] as $index => $slug) {
            if (isset($writingMap[$slug])) {
                $sync[$writingMap[$slug]] = ['order' => $index];
            } else {
                $this->warnings[] = "pages: writing slug '{$slug}' not found for page '{$item['slug']}'";
            }
        }
        $page->featuredWritings()->sync($sync);
    }

    private function buildSlugIdMap($modelClass): array
    {
        $map = [];
        foreach ($modelClass::all() as $model) {
            $map[$model->slug] = $model->id;
        }

        return $map;
    }

    private function camelToSnake(string $str): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $str));
    }

    private function printSummary(): void
    {
        $this->info('');
        $this->info('=== Import Summary ===');

        if ($this->option('dry-run')) {
            $this->warn('DRY RUN — no changes were committed');
        }

        $this->table(
            ['Entity', 'Created', 'Updated'],
            array_map(function ($entity) {
                return [
                    $entity,
                    $this->created[$entity] ?? 0,
                    $this->updated[$entity] ?? 0,
                ];
            }, array_unique(array_merge(array_keys($this->created), array_keys($this->updated))))
        );

        $this->info('');
        if (count($this->warnings) > 0) {
            $this->warn('Warnings: '.count($this->warnings).' issues encountered');
            foreach ($this->warnings as $warning) {
                $this->line('  - '.$warning);
            }
        } else {
            $this->info('No warnings');
        }
    }
}
