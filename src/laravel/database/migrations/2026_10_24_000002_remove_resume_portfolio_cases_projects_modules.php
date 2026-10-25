<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $this->removePublicPages();
            $this->removeNavigationItems();
            $this->removeContentReferences();
            $this->removeResumeData();
            $this->removeProjectData();
            $this->removeCaseStudyData();
            $this->removeExperimentData();
            $this->removeObsoleteColumns();
        });
    }

    public function down(): void {}

    private function removePublicPages(): void
    {
        if (! Schema::hasTable('pages')) {
            return;
        }

        $pageIds = DB::table('pages')
            ->whereIn('slug', ['resume', 'portfolio', 'cases', 'projects'])
            ->pluck('id');

        if ($pageIds->isEmpty()) {
            return;
        }

        $revisionIds = $this->ids('page_revisions', 'page_id', $pageIds);

        foreach ([
            'page_revision_home_sections' => 'page_revision_id',
            'page_revision_featured_writings' => 'page_revision_id',
            'page_revision_featured_cases' => 'page_revision_id',
            'page_revision_featured_projects' => 'page_revision_id',
            'page_revision_translations' => 'page_revision_id',
        ] as $table => $column) {
            $this->deleteWhereIn($table, $column, $revisionIds);
        }

        $this->deleteWhereIn('page_revisions', 'id', $revisionIds);
        $this->deleteWhereIn('page_translations', 'page_id', $pageIds);
        $this->deleteWhereIn('pages', 'id', $pageIds);
    }

    private function removeNavigationItems(): void
    {
        if (! Schema::hasTable('nav_items')) {
            return;
        }

        $routeNames = ['portfolio.show', 'resume.show', 'cases.show', 'projects.show', 'projects.experiments.show'];
        $itemIds = DB::table('nav_items as items')
            ->leftJoin('nav_item_revisions as revisions', 'revisions.nav_item_id', '=', 'items.id')
            ->where(function ($query) use ($routeNames): void {
                $query
                    ->whereIn('items.route_name', $routeNames)
                    ->orWhereIn('revisions.route_name', $routeNames);
            })
            ->distinct()
            ->pluck('items.id');

        if ($itemIds->isEmpty()) {
            return;
        }

        $revisionIds = $this->ids('nav_item_revisions', 'nav_item_id', $itemIds);
        $this->deleteWhereIn('nav_item_revision_translations', 'nav_item_revision_id', $revisionIds);
        $this->deleteWhereIn('nav_item_revisions', 'id', $revisionIds);
        $this->deleteWhereIn('nav_item_translations', 'nav_item_id', $itemIds);
        $this->deleteWhereIn('nav_items', 'id', $itemIds);
    }

    private function removeContentReferences(): void
    {
        foreach (['content_publications', 'content_revision_metrics', 'content_revision_seo'] as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)
                    ->whereIn('content_type', ['resume', 'project', 'case_study', 'experiment'])
                    ->delete();
            }
        }

        foreach ([
            'page_revision_featured_cases',
            'page_revision_featured_projects',
            'project_revision_technologies',
            'case_study_revision_technologies',
            'experiment_revision_technologies',
            'resume_revision_selected_cases',
            'resume_revision_skills',
            'resume_revision_languages',
            'resume_revision_skill_technologies',
            'page_featured_case',
            'page_featured_project',
            'page_featured_writing',
            'project_technology',
            'case_study_technology',
            'experiment_technology',
            'resume_selected_case',
            'resume_skill_technology',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }

    private function removeResumeData(): void
    {
        $revisionIds = $this->ids('resume_revisions', 'resume_id', $this->allIds('resumes'));
        $translationIds = $this->ids('resume_revision_translations', 'resume_revision_id', $revisionIds);

        foreach ([
            'resume_revision_education',
            'resume_revision_leadership',
            'resume_revision_certificates',
            'resume_revision_certifications',
            'resume_revision_publications',
            'resume_revision_recommendations',
            'resume_revision_technical_productions',
            'resume_revision_events',
            'resume_revision_awards',
        ] as $table) {
            $this->deleteWhereIn($table, 'resume_revision_translation_id', $translationIds);
        }

        $this->deleteWhereIn('resume_revision_translations', 'id', $translationIds);
        $this->deleteWhereIn('resume_revisions', 'id', $revisionIds);
        $this->deleteWhereIn('resume_translations', 'resume_id', $this->allIds('resumes'));

        foreach ([
            'resume_revision_skill_technologies',
            'resume_revision_selected_cases',
            'resume_revision_skills',
            'resume_revision_languages',
            'resume_skill_technology',
            'resume_selected_case',
            'resume_skills',
            'resume_languages',
        ] as $table) {
            Schema::dropIfExists($table);
        }

        Schema::dropIfExists('resume_revision_translations');
        Schema::dropIfExists('resume_revisions');
        Schema::dropIfExists('resume_translations');
        Schema::dropIfExists('resumes');
    }

    private function removeProjectData(): void
    {
        $this->removeRevisionEntity(
            'projects',
            'project_revisions',
            'project_revision_translations',
            ['project_revision_technologies'],
            ['project_translations', 'project_revisions', 'projects'],
        );
        Schema::dropIfExists('project_technology');
        Schema::dropIfExists('project_revision_technologies');
    }

    private function removeCaseStudyData(): void
    {
        $this->removeRevisionEntity(
            'case_studies',
            'case_study_revisions',
            'case_study_revision_translations',
            ['case_study_revision_technologies'],
            ['case_study_translations', 'case_study_revisions', 'case_studies'],
        );
        Schema::dropIfExists('case_study_technology');
        Schema::dropIfExists('case_study_revision_technologies');
    }

    private function removeExperimentData(): void
    {
        $this->removeRevisionEntity(
            'experiments',
            'experiment_revisions',
            'experiment_revision_translations',
            ['experiment_revision_technologies'],
            ['experiment_translations', 'experiment_revisions', 'experiments'],
        );
        Schema::dropIfExists('experiment_technology');
        Schema::dropIfExists('experiment_revision_technologies');
    }

    private function removeRevisionEntity(
        string $identityTable,
        string $revisionTable,
        string $translationTable,
        array $relationTables,
        array $legacyTables,
    ): void {
        $identityIds = $this->allIds($identityTable);
        $revisionIds = $this->ids($revisionTable, Str::singular($identityTable).'_id', $identityIds);

        foreach ($relationTables as $table) {
            Schema::dropIfExists($table);
        }

        $translationIds = $this->ids($translationTable, Str::singular($revisionTable).'_id', $revisionIds);
        $this->deleteWhereIn($translationTable, 'id', $translationIds);

        foreach (array_reverse($legacyTables) as $table) {
            Schema::dropIfExists($table);
        }
    }

    private function removeObsoleteColumns(): void
    {
        $this->dropColumns('site_settings', ['portfolio_url']);
        $this->dropColumns('site_settings_revisions', ['portfolio_url']);
        $this->dropColumns('page_revision_translations', [
            'projects_description',
            'projects_eyebrow',
            'projects_title',
            'experiments_summary',
            'experiments_title',
        ]);
        $this->dropColumns('profile_revision_trajectory', ['include_in_resume']);
    }

    private function allIds(string $table): Collection
    {
        if (! Schema::hasTable($table)) {
            return collect();
        }

        return DB::table($table)->pluck('id');
    }

    private function ids(string $table, string $column, Collection $ids): Collection
    {
        if ($ids->isEmpty() || ! Schema::hasTable($table)) {
            return collect();
        }

        return DB::table($table)->whereIn($column, $ids)->pluck('id');
    }

    private function deleteWhereIn(string $table, string $column, Collection $ids): void
    {
        if ($ids->isEmpty() || ! Schema::hasTable($table)) {
            return;
        }

        DB::table($table)->whereIn($column, $ids)->delete();
    }

    private function dropColumns(string $table, array $columns): void
    {
        if (! Schema::hasTable($table)) {
            return;
        }

        $existing = array_values(array_filter($columns, fn (string $column): bool => Schema::hasColumn($table, $column)));

        if ($existing !== []) {
            Schema::table($table, function ($blueprint) use ($existing): void {
                $blueprint->dropColumn($existing);
            });
        }
    }
};
