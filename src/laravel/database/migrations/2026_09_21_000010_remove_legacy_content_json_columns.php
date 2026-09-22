<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const COLUMNS = [
        'resources' => ['authors', 'organizations', 'type_details'],
        'page_translations' => ['fields'],
        'resource_translations' => ['seo'],
        'case_study_translations' => ['metrics', 'seo'],
        'experiment_translations' => ['seo'],
        'project_translations' => ['metrics', 'seo'],
        'reference_collection_translations' => ['seo'],
        'writing_translations' => ['seo'],
        'site_settings_translations' => ['seo'],
        'profile_translations' => [
            'personal_interests', 'trajectory', 'milestones', 'fortunes', 'personal_facts', 'personal_things',
        ],
        'resume_translations' => [
            'leadership', 'education', 'certificates', 'certifications', 'publications', 'recommendations',
            'technical_productions', 'events', 'awards',
        ],
    ];

    public function up(): void
    {
        foreach (self::COLUMNS as $table => $columns) {
            $existing = array_values(array_filter($columns, fn (string $column): bool => Schema::hasColumn($table, $column)));
            if ($existing === []) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) use ($existing): void {
                $blueprint->dropColumn($existing);
            });
        }
    }

    public function down(): void
    {
        $definitions = [
            'resources' => ['authors', 'organizations', 'type_details'],
            'page_translations' => ['fields'],
            'resource_translations' => ['seo'],
            'case_study_translations' => ['metrics', 'seo'],
            'experiment_translations' => ['seo'],
            'project_translations' => ['metrics', 'seo'],
            'reference_collection_translations' => ['seo'],
            'writing_translations' => ['seo'],
            'site_settings_translations' => ['seo'],
            'profile_translations' => [
                'personal_interests', 'trajectory', 'milestones', 'fortunes', 'personal_facts', 'personal_things',
            ],
            'resume_translations' => [
                'leadership', 'education', 'certificates', 'certifications', 'publications', 'recommendations',
                'technical_productions', 'events', 'awards',
            ],
        ];

        foreach ($definitions as $table => $columns) {
            $missing = array_values(array_filter($columns, fn (string $column): bool => ! Schema::hasColumn($table, $column)));
            if ($missing === []) {
                continue;
            }

            Schema::table($table, function (Blueprint $blueprint) use ($missing): void {
                foreach ($missing as $column) {
                    $blueprint->text($column)->nullable();
                }
            });
        }
    }
};
