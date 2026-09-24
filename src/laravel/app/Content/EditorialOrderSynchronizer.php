<?php

namespace App\Content;

use App\Events\PublicSiteContentChanged;
use Illuminate\Support\Facades\DB;

final class EditorialOrderSynchronizer
{
    private const DEFINITIONS = [
        'case_studies' => 'case_study_revisions',
        'credit_entries' => 'credit_entry_revisions',
        'experiments' => 'experiment_revisions',
        'languages' => 'language_revisions',
        'nav_items' => 'nav_item_revisions',
        'projects' => 'project_revisions',
        'reference_collections' => 'reference_collection_revisions',
        'resources' => 'resource_revisions',
        'snippets' => 'snippet_revisions',
        'technologies' => 'technology_revisions',
        'topics' => 'topic_revisions',
    ];

    public function synchronize(string $table, array $order): void
    {
        $revisionTable = self::DEFINITIONS[$table] ?? null;

        if ($revisionTable === null || $order === []) {
            return;
        }

        DB::transaction(function () use ($table, $revisionTable, $order): void {
            $records = DB::table($table)
                ->whereIn('id', $order)
                ->get(['id', 'current_revision_id', 'published_revision_id']);

            $positions = collect($order)
                ->mapWithKeys(fn (int|string $id, int $position): array => [(string) $id => $position + 1]);

            foreach ($records as $record) {
                $position = $positions->get((string) $record->id);

                if ($position === null) {
                    continue;
                }

                $revisionIds = collect([$record->current_revision_id, $record->published_revision_id])
                    ->filter()
                    ->unique()
                    ->values();

                if ($revisionIds->isNotEmpty()) {
                    DB::table($revisionTable)
                        ->whereIn('id', $revisionIds)
                        ->update(['order' => $position]);
                }
            }
        });

        PublicSiteContentChanged::dispatch();
    }
}
