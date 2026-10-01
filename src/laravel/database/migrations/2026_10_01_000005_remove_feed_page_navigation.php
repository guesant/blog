<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $itemIds = DB::table('nav_items')
                ->where('route_name', 'feed')
                ->pluck('id');

            if ($itemIds->isEmpty()) {
                return;
            }

            DB::table('nav_item_revisions')->whereIn('nav_item_id', $itemIds)->delete();
            DB::table('nav_items')->whereIn('id', $itemIds)->delete();
        });
    }

    public function down(): void
    {
        throw new RuntimeException('The retired /feed page is not restored automatically.');
    }
};
