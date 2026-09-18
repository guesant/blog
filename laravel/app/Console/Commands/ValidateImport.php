<?php

namespace App\Console\Commands;

use App\Models\CaseStudy;
use App\Models\CreditEntry;
use App\Models\Experiment;
use App\Models\Language;
use App\Models\Page;
use App\Models\Profile;
use App\Models\Project;
use App\Models\ReferenceCollection;
use App\Models\Resource;
use App\Models\Resume;
use App\Models\SiteSettings;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

#[Signature('portfolio:validate-import')]
#[Description('Validate that imported data matches snapshot files')]
class ValidateImport extends Command
{
    private array $results = [];

    private bool $hasErrors = false;

    public function handle()
    {
        $this->validateCollections();
        $this->validateSingletons();
        $this->validateTranslations();
        $this->printResults();

        return $this->hasErrors ? 1 : 0;
    }

    private function validateCollections(): void
    {
        $collections = [
            'technologies' => Technology::class,
            'languages' => Language::class,
            'cases' => CaseStudy::class,
            'projects' => Project::class,
            'experiments' => Experiment::class,
            'writing' => Writing::class,
            'references' => Resource::class,
            'collections' => ReferenceCollection::class,
            'pages' => Page::class,
        ];

        foreach ($collections as $filename => $modelClass) {
            $this->validateCollection($filename, $modelClass);
            $this->validateCollectionTranslations($filename, $modelClass);
        }

        $this->validateTopics();
    }

    private function validateTopics(): void
    {
        $topicsPath = '/migration-snapshot/topics.json';
        $categoriesPath = '/migration-snapshot/categories.json';
        $tagsPath = '/migration-snapshot/tags.json';

        if (! File::exists($topicsPath) || ! File::exists($categoriesPath) || ! File::exists($tagsPath)) {
            $this->results['topics'] = ['status' => 'SKIP', 'reason' => 'File not found'];

            return;
        }

        $topics = json_decode(File::get($topicsPath), true);
        $categories = json_decode(File::get($categoriesPath), true);
        $tags = json_decode(File::get($tagsPath), true);

        if (! is_array($topics) || ! is_array($categories) || ! is_array($tags)) {
            $this->results['topics'] = ['status' => 'FAIL', 'reason' => 'Invalid JSON'];
            $this->hasErrors = true;

            return;
        }

        $subjectSlugs = array_map(
            fn ($item) => $item['slug'],
            array_filter($categories, fn ($item) => ($item['kind'] ?? null) === 'writing-subject')
        );

        $expectedSlugs = array_unique(array_merge(
            array_map(fn ($item) => $item['slug'], $topics),
            $subjectSlugs,
            array_map(fn ($item) => $item['slug'], $tags),
        ));

        $snapshotCount = count($expectedSlugs);
        $dbCount = Topic::count();

        if ($snapshotCount === $dbCount) {
            $this->results['topics'] = ['status' => 'PASS', 'snapshot' => $snapshotCount, 'database' => $dbCount];
            $this->validateCollectionTranslations('topics', Topic::class);
        } else {
            $this->results['topics'] = ['status' => 'FAIL', 'snapshot' => $snapshotCount, 'database' => $dbCount, 'reason' => 'Count mismatch'];
            $this->hasErrors = true;
        }
    }

    /**
     * Load and decode a snapshot JSON file, recording a SKIP/FAIL result
     * under $filename when it is missing or not valid JSON.
     *
     * @return array<mixed>|null
     */
    private function loadSnapshotJson(string $filename, string $invalidJsonReason = 'Invalid JSON'): ?array
    {
        $path = "/migration-snapshot/{$filename}.json";
        if (! File::exists($path)) {
            $this->results[$filename] = ['status' => 'SKIP', 'reason' => 'File not found'];

            return null;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            $this->results[$filename] = ['status' => 'FAIL', 'reason' => $invalidJsonReason];
            $this->hasErrors = true;

            return null;
        }

        return $data;
    }

    private function validateCollection(string $filename, string $modelClass): void
    {
        $data = $this->loadSnapshotJson($filename);
        if ($data === null) {
            return;
        }

        $snapshotCount = count($data);
        $dbCount = $modelClass::count();

        if ($snapshotCount === $dbCount) {
            $this->results[$filename] = ['status' => 'PASS', 'snapshot' => $snapshotCount, 'database' => $dbCount];
        } else {
            $this->results[$filename] = ['status' => 'FAIL', 'snapshot' => $snapshotCount, 'database' => $dbCount, 'reason' => 'Count mismatch'];
            $this->hasErrors = true;
        }
    }

    private function validateSingletons(): void
    {
        $singletons = [
            'profile' => Profile::class,
            'resume' => Resume::class,
            'settings' => SiteSettings::class,
        ];

        foreach ($singletons as $filename => $modelClass) {
            $this->validateSingleton($filename, $modelClass);
        }

        $this->validateCredits();
    }

    private function validateSingleton(string $filename, string $modelClass): void
    {
        if ($this->loadSnapshotJson($filename, 'Invalid JSON or not an array') === null) {
            return;
        }

        $dbCount = $modelClass::count();

        if ($dbCount === 1) {
            $this->results[$filename] = ['status' => 'PASS', 'exists' => true];
        } else {
            $this->results[$filename] = ['status' => 'FAIL', 'count' => $dbCount, 'reason' => 'Expected exactly 1 row'];
            $this->hasErrors = true;
        }
    }

    private function validateCredits(): void
    {
        $path = '/migration-snapshot/credits.json';
        if (! File::exists($path)) {
            $this->results['credits'] = ['status' => 'SKIP', 'reason' => 'File not found'];

            return;
        }

        $data = json_decode(File::get($path), true);
        if (! is_array($data)) {
            $this->results['credits'] = ['status' => 'FAIL', 'reason' => 'Invalid JSON'];
            $this->hasErrors = true;

            return;
        }

        $snapshotCount = count($data['entries'] ?? []);
        $dbCount = CreditEntry::count();

        if ($snapshotCount === $dbCount) {
            $this->results['credits'] = ['status' => 'PASS', 'snapshot' => $snapshotCount, 'database' => $dbCount];
        } else {
            $this->results['credits'] = ['status' => 'FAIL', 'snapshot' => $snapshotCount, 'database' => $dbCount, 'reason' => 'Count mismatch'];
            $this->hasErrors = true;
        }
    }

    private function validateTranslations(): void
    {
        $singletons = [
            'profile' => Profile::class,
            'resume' => Resume::class,
            'settings' => SiteSettings::class,
        ];

        foreach ($singletons as $filename => $modelClass) {
            $this->validateSingletonTranslations($filename, $modelClass);
        }
    }

    private function validateCollectionTranslations(string $filename, string $modelClass): void
    {
        if (! isset($this->results[$filename]) || $this->results[$filename]['status'] !== 'PASS') {
            return;
        }

        foreach ($modelClass::all() as $model) {
            $locales = $this->translationLocales($modelClass, $model->id);

            if (! in_array('en', $locales) || ! in_array('pt-BR', $locales)) {
                $this->results["{$filename}_translations"] = [
                    'status' => 'FAIL',
                    'reason' => "Model ID {$model->id} missing translations",
                    'locales' => $locales,
                ];
                $this->hasErrors = true;

                return;
            }
        }
    }

    private function validateSingletonTranslations(string $filename, string $modelClass): void
    {
        if (! isset($this->results[$filename]) || $this->results[$filename]['status'] !== 'PASS') {
            return;
        }

        $model = $modelClass::first();
        if (! $model) {
            return;
        }

        $locales = $this->translationLocales($modelClass, $model->id);

        if (! in_array('en', $locales) || ! in_array('pt-BR', $locales)) {
            $this->results["{$filename}_translations"] = [
                'status' => 'FAIL',
                'reason' => 'Missing both en and pt-BR translations',
                'locales' => $locales,
            ];
            $this->hasErrors = true;
        }
    }

    /**
     * @return array<int, string>
     */
    private function translationLocales(string $modelClass, int|string $modelId): array
    {
        $key = class_basename($modelClass);
        $translationClass = "App\\Models\\{$key}Translation";
        $foreignKeyColumn = $this->camelToSnake($key).'_id';

        return $translationClass::where($foreignKeyColumn, $modelId)->pluck('locale')->toArray();
    }

    private function camelToSnake(string $str): string
    {
        return strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $str));
    }

    private function printResults(): void
    {
        $this->info('');
        $this->info('=== Import Validation Results ===');

        $rows = [];
        foreach ($this->results as $name => $result) {
            $status = match ($result['status']) {
                'PASS' => '<fg=green>PASS</>',
                'FAIL' => '<fg=red>FAIL</>',
                'SKIP' => '<fg=yellow>SKIP</>',
                default => throw new \LogicException("Unexpected validation status: {$result['status']}"),
            };

            $details = '';
            if (isset($result['snapshot']) && isset($result['database'])) {
                $details = "snapshot: {$result['snapshot']}, db: {$result['database']}";
            } elseif ($result['status'] === 'FAIL') {
                $details = $result['reason'] ?? '';
            }

            $rows[] = [$name, $status, $details];
        }

        $this->table(['Collection', 'Status', 'Details'], $rows);

        $this->info('');
        if ($this->hasErrors) {
            $this->error('VALIDATION FAILED');
        } else {
            $this->info('<fg=green>All validations passed!</>');
        }
    }
}
