<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $group = DB::table('sidebar_groups')->where('key', 'content')->first();

            if ($group === null || DB::table('nav_items')->where('route_name', 'feed')->exists()) {
                return;
            }

            $now = now();
            $order = ((int) DB::table('nav_items')
                ->where('sidebar_group_id', $group->id)
                ->max('order')) + 1;
            $itemId = DB::table('nav_items')->insertGetId([
                'route_name' => 'feed',
                'parent_id' => null,
                'placement' => 'sidebar',
                'sidebar_group_id' => $group->id,
                'order' => $order,
                'hidden' => false,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $revisionId = DB::table('nav_item_revisions')->insertGetId([
                'nav_item_id' => $itemId,
                'revision_number' => 1,
                'created_by' => null,
                'created_at' => $now,
                'updated_at' => $now,
                'route_name' => 'feed',
                'parent_id' => null,
                'placement' => 'sidebar',
                'sidebar_group_id' => $group->id,
                'order' => $order,
                'hidden' => false,
            ]);

            DB::table('nav_items')->where('id', $itemId)->update([
                'current_revision_id' => $revisionId,
                'published_revision_id' => $revisionId,
            ]);
        });
    }

    public function down(): void {}
};
