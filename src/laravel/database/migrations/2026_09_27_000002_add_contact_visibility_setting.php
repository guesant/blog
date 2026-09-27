<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('site_settings', 'contact_enabled')) {
            Schema::table('site_settings', function (Blueprint $table): void {
                $table->boolean('contact_enabled')->default(true);
            });
        }

        if (! Schema::hasColumn('site_settings_revisions', 'contact_enabled')) {
            Schema::table('site_settings_revisions', function (Blueprint $table): void {
                $table->boolean('contact_enabled')->default(true)->nullable();
            });
        }

        DB::table('site_settings')->update(['contact_enabled' => true]);
        DB::table('site_settings_revisions')
            ->whereNull('contact_enabled')
            ->update(['contact_enabled' => true]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('site_settings_revisions', 'contact_enabled')) {
            Schema::table('site_settings_revisions', function (Blueprint $table): void {
                $table->dropColumn('contact_enabled');
            });
        }

        if (Schema::hasColumn('site_settings', 'contact_enabled')) {
            Schema::table('site_settings', function (Blueprint $table): void {
                $table->dropColumn('contact_enabled');
            });
        }
    }
};
