<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('nav_item_revision_translations');
    }

    public function down(): void
    {
        throw new RuntimeException('Public navigation labels are maintained by the frontend catalogs.');
    }
};
