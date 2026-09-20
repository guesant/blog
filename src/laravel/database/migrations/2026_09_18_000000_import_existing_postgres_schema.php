<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('resources')) {
            return;
        }

        DB::unprepared(file_get_contents(database_path('schema/portfolio.sql')));
    }

    public function down(): void {}
};
