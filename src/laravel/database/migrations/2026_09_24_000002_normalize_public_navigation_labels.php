<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $this->updateLabel('findings', 'en', 'Findings');
            $this->updateLabel('findings', 'pt-BR', 'Achados');
            $this->updateLabel('projects', 'en', 'Projects');
            $this->updateLabel('projects', 'pt-BR', 'Projetos');
            $this->updatePageTitle('achados', 'en', "Things I've Found");
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Navigation labels are editorial data and must be restored from a database backup.');
    }

    private function updateLabel(string $routeName, string $locale, string $label): void
    {
        $revisionIds = DB::table('nav_items')
            ->where('route_name', $routeName)
            ->pluck('current_revision_id')
            ->filter();

        if ($revisionIds->isEmpty()) {
            return;
        }

        DB::table('nav_item_revision_translations')
            ->whereIn('nav_item_revision_id', $revisionIds)
            ->where('locale', $locale)
            ->update(['label' => $label]);
    }

    private function updatePageTitle(string $slug, string $locale, string $title): void
    {
        $revisionIds = DB::table('pages')
            ->where('slug', $slug)
            ->whereNotNull('current_revision_id')
            ->pluck('current_revision_id');

        if ($revisionIds->isEmpty()) {
            return;
        }

        DB::table('page_revision_translations')
            ->whereIn('page_revision_id', $revisionIds)
            ->where('locale', $locale)
            ->update(['title' => $title]);
    }
};
