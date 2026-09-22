<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $navItemIds = DB::table('nav_items')
                ->where('route_name', 'knowledge-map')
                ->pluck('id');

            if ($navItemIds->isEmpty()) {
                return;
            }

            $revisionIds = DB::table('nav_item_revisions')
                ->whereIn('nav_item_id', $navItemIds)
                ->pluck('id');

            DB::table('nav_item_revision_translations')
                ->whereIn('nav_item_revision_id', $revisionIds)
                ->delete();
            DB::table('nav_item_revisions')
                ->whereIn('id', $revisionIds)
                ->delete();
            DB::table('nav_items')
                ->whereIn('id', $navItemIds)
                ->delete();
        });
    }

    public function down(): void
    {
        throw new RuntimeException('The removed knowledge map navigation record is recoverable from the database backup only.');
    }
};
