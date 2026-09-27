<?php

use App\Content\HomeGallerySection;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('page_revision_home_sections', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('page_revision_id');
            $table->string('section_key', 80);
            $table->boolean('enabled')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['page_revision_id', 'section_key']);
            $table->index(['page_revision_id', 'enabled', 'sort_order']);
        });

        $revisionId = DB::table('pages')
            ->where('slug', 'home')
            ->value('current_revision_id');

        if ($revisionId === null) {
            return;
        }

        $now = now();
        $rows = [];
        foreach (array_keys(HomeGallerySection::DEFAULTS) as $sortOrder => $sectionKey) {
            $rows[] = [
                'page_revision_id' => $revisionId,
                'section_key' => $sectionKey,
                'enabled' => HomeGallerySection::DEFAULTS[$sectionKey],
                'sort_order' => $sortOrder,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::table('page_revision_home_sections')->insert($rows);
    }

    public function down(): void
    {
        Schema::dropIfExists('page_revision_home_sections');
    }
};
