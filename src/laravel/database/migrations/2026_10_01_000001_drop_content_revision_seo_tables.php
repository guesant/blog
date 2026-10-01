<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('content_revision_seo_keywords');
        Schema::dropIfExists('content_revision_seo');
    }

    public function down(): void
    {
        throw new RuntimeException('SEO override data is recoverable from the database backup only.');
    }
};
