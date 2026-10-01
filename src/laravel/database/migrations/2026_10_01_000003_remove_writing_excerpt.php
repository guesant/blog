<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('writing_revision_translations', 'excerpt')) {
            return;
        }

        DB::table('writing_revision_translations')
            ->whereNotNull('excerpt')
            ->where(fn ($query) => $query->whereNull('body')->orWhere('body', ''))
            ->update(['body' => DB::raw('excerpt')]);

        Schema::table('writing_revision_translations', function (Blueprint $table): void {
            $table->dropColumn('excerpt');
        });
    }

    public function down(): void {}
};
