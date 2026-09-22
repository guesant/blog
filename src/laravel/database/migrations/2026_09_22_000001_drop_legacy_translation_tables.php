<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([
            'case_study_translations',
            'credit_entry_translations',
            'experiment_translations',
            'language_translations',
            'nav_item_translations',
            'page_translations',
            'profile_translations',
            'project_translations',
            'reference_collection_translations',
            'resource_translations',
            'resume_translations',
            'site_settings_translations',
            'snippet_translations',
            'technology_translations',
            'topic_translations',
            'writing_translations',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }

    public function down(): void
    {
        throw new RuntimeException('Legacy translation tables are recoverable from the database backup only.');
    }
};
