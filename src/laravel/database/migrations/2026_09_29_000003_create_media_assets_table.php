<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_assets', function (Blueprint $table): void {
            $table->id();
            $table->string('disk', 64);
            $table->string('path', 1024);
            $table->string('original_name')->nullable();
            $table->string('mime_type', 255)->nullable();
            $table->unsignedBigInteger('size')->nullable();
            $table->char('checksum', 64)->nullable();
            $table->string('visibility', 32)->default('private')->index();
            $table->timestampTz('last_referenced_at')->nullable()->index();
            $table->timestampsTz();
            $table->unique(['disk', 'path']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_assets');
    }
};
