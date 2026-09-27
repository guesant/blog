<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const FLAGS = [
        'content_actions_copy_text',
        'content_actions_copy_url',
        'content_actions_download_text',
        'contextual_cursor_enabled',
    ];

    public function up(): void
    {
        foreach (self::FLAGS as $flag) {
            if (! Schema::hasColumn('site_settings', $flag)) {
                Schema::table('site_settings', function (Blueprint $table) use ($flag): void {
                    $table->boolean($flag)->default(false);
                });
            }

            if (! Schema::hasColumn('site_settings_revisions', $flag)) {
                Schema::table('site_settings_revisions', function (Blueprint $table) use ($flag): void {
                    $table->boolean($flag)->default(false)->nullable();
                });
            }
        }

        DB::table('site_settings')->update(array_fill_keys(self::FLAGS, false));
        DB::table('site_settings_revisions')
            ->where(function ($query): void {
                foreach (self::FLAGS as $flag) {
                    $query->orWhereNull($flag);
                }
            })
            ->update(array_fill_keys(self::FLAGS, false));
    }

    public function down(): void
    {
        foreach (self::FLAGS as $flag) {
            if (Schema::hasColumn('site_settings_revisions', $flag)) {
                Schema::table('site_settings_revisions', function (Blueprint $table) use ($flag): void {
                    $table->dropColumn($flag);
                });
            }

            if (Schema::hasColumn('site_settings', $flag)) {
                Schema::table('site_settings', function (Blueprint $table) use ($flag): void {
                    $table->dropColumn($flag);
                });
            }
        }
    }
};
