<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('content_revision_counters');
    }

    public function down(): void
    {
        if (Schema::hasTable('content_revision_counters')) {
            return;
        }

        Schema::create('content_revision_counters', function (Blueprint $table): void {
            $table->unsignedInteger('id')->primary();
            $table->unsignedBigInteger('version');
            $table->timestamp('updated_at');
        });
    }
};
