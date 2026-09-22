<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resume_revision_languages', function (Blueprint $table): void {
            if (! Schema::hasColumn('resume_revision_languages', 'proficiency')) {
                $table->text('proficiency')->nullable();
            }
        });

        if (! Schema::hasTable('resume_revision_skill_technologies')) {
            Schema::create('resume_revision_skill_technologies', function (Blueprint $table): void {
                $table->unsignedInteger('resume_revision_id');
                $table->unsignedInteger('topic_id');
                $table->unsignedInteger('technology_id');
                $table->unsignedInteger('sort_order')->default(0);
                $table->primary(['resume_revision_id', 'topic_id', 'technology_id']);
            });
        }

        DB::table('resumes')->orderBy('id')->each(function (object $resume): void {
            $revisionId = DB::table('resumes')->where('id', $resume->id)->value('current_revision_id');
            if ($revisionId === null) {
                return;
            }

            foreach (DB::table('resume_languages')->where('resume_id', $resume->id)->get() as $language) {
                DB::table('resume_revision_languages')
                    ->where('resume_revision_id', $revisionId)
                    ->where('language_id', $language->language_id)
                    ->update(['proficiency' => $language->proficiency]);
            }

            foreach (DB::table('resume_skills')->where('resume_id', $resume->id)->get() as $skill) {
                foreach (DB::table('resume_skill_technology')->where('resume_skill_id', $skill->id)->get() as $technology) {
                    DB::table('resume_revision_skill_technologies')->insertOrIgnore([
                        'resume_revision_id' => $revisionId,
                        'topic_id' => $skill->topic_id,
                        'technology_id' => $technology->technology_id,
                        'sort_order' => 0,
                    ]);
                }
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resume_revision_skill_technologies');

        if (Schema::hasColumn('resume_revision_languages', 'proficiency')) {
            Schema::table('resume_revision_languages', function (Blueprint $table): void {
                $table->dropColumn('proficiency');
            });
        }
    }
};
