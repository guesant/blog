<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platforms', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('slug', 255)->unique();
            $table->string('label', 255);
            $table->timestamps();
        });

        $knownLabels = [
            'github' => 'GitHub',
            'gitlab' => 'GitLab',
            'linkedin' => 'LinkedIn',
            'lattes' => 'Lattes',
            'orcid' => 'ORCID',
            'scholar' => 'Google Scholar',
            'researchgate' => 'ResearchGate',
            'mastodon' => 'Mastodon',
            'bluesky' => 'Bluesky',
            'youtube' => 'YouTube',
            'website' => 'Website',
        ];

        $platforms = [];

        if (Schema::hasTable('contact_profiles')) {
            foreach (DB::table('contact_profiles')->select(['platform', 'label'])->get() as $profile) {
                $slug = trim((string) $profile->platform);

                if ($slug === '' || array_key_exists($slug, $platforms)) {
                    continue;
                }

                $label = trim((string) ($profile->label ?? ''));
                $platforms[$slug] = $label !== '' ? $label : ($knownLabels[$slug] ?? Str::headline($slug));
            }
        }

        foreach ($knownLabels as $slug => $label) {
            if (! array_key_exists($slug, $platforms)) {
                $platforms[$slug] = $label;
            }
        }

        foreach ($platforms as $slug => $label) {
            DB::table('platforms')->insert([
                'slug' => $slug,
                'label' => $label,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::table('contact_profiles', function (Blueprint $table): void {
            $table->unsignedInteger('platform_id')->nullable()->after('site_settings_id');
            $table->foreign('platform_id')->references('id')->on('platforms')->restrictOnDelete();
        });

        foreach (DB::table('contact_profiles')->select(['id', 'platform'])->get() as $profile) {
            $platformId = DB::table('platforms')->where('slug', trim((string) $profile->platform))->value('id');

            if ($platformId !== null) {
                DB::table('contact_profiles')
                    ->where('id', $profile->id)
                    ->update(['platform_id' => $platformId]);
            }
        }

        DB::statement('ALTER TABLE contact_profiles ALTER COLUMN platform_id SET NOT NULL');

        Schema::table('contact_profiles', function (Blueprint $table): void {
            $table->dropColumn(['platform', 'label']);
        });
    }

    public function down(): void
    {
        Schema::table('contact_profiles', function (Blueprint $table): void {
            $table->string('platform', 255)->nullable()->after('site_settings_id');
            $table->text('label')->nullable();
        });

        foreach (DB::table('contact_profiles')->select(['id', 'platform_id'])->get() as $profile) {
            $platform = DB::table('platforms')->where('id', $profile->platform_id)->first();

            DB::table('contact_profiles')
                ->where('id', $profile->id)
                ->update([
                    'platform' => $platform?->slug,
                    'label' => $platform?->label,
                ]);
        }

        Schema::table('contact_profiles', function (Blueprint $table): void {
            $table->dropForeign(['platform_id']);
            $table->dropColumn('platform_id');
        });

        Schema::dropIfExists('platforms');
    }
};
