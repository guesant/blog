<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('site_settings', 'feed_flat_cards_enabled')) {
            Schema::table('site_settings', function (Blueprint $table): void {
                $table->boolean('feed_flat_cards_enabled')->default(true);
            });
        }

        if (! Schema::hasColumn('site_settings_revisions', 'feed_flat_cards_enabled')) {
            Schema::table('site_settings_revisions', function (Blueprint $table): void {
                $table->boolean('feed_flat_cards_enabled')->default(true)->nullable();
            });
        }

        DB::table('site_settings')->update(['feed_flat_cards_enabled' => true]);
        DB::table('site_settings_revisions')->update(['feed_flat_cards_enabled' => true]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('site_settings_revisions', 'feed_flat_cards_enabled')) {
            Schema::table('site_settings_revisions', function (Blueprint $table): void {
                $table->dropColumn('feed_flat_cards_enabled');
            });
        }

        if (Schema::hasColumn('site_settings', 'feed_flat_cards_enabled')) {
            Schema::table('site_settings', function (Blueprint $table): void {
                $table->dropColumn('feed_flat_cards_enabled');
            });
        }
    }
};
