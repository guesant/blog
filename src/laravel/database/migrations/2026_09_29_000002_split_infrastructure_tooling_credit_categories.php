<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $infrastructureId = DB::table('credit_categories')
                ->where('slug', 'infrastructure')
                ->value('id');

            if ($infrastructureId === null) {
                $infrastructureId = DB::table('credit_categories')->insertGetId([
                    'slug' => 'infrastructure',
                    'order' => 0,
                    'active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('credit_category_translations')->updateOrInsert(
                ['credit_category_id' => $infrastructureId, 'locale' => 'en'],
                ['name' => 'Infrastructure', 'updated_at' => now(), 'created_at' => now()],
            );
            DB::table('credit_category_translations')->updateOrInsert(
                ['credit_category_id' => $infrastructureId, 'locale' => 'pt-BR'],
                ['name' => 'Infraestrutura', 'updated_at' => now(), 'created_at' => now()],
            );

            $toolingId = DB::table('credit_categories')
                ->where('slug', 'tooling')
                ->value('id');

            if ($toolingId === null) {
                $toolingId = DB::table('credit_categories')->insertGetId([
                    'slug' => 'tooling',
                    'order' => ((int) DB::table('credit_categories')->where('id', $infrastructureId)->value('order')) + 1,
                    'active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('credit_category_translations')->updateOrInsert(
                ['credit_category_id' => $toolingId, 'locale' => 'en'],
                ['name' => 'Tooling', 'updated_at' => now(), 'created_at' => now()],
            );
            DB::table('credit_category_translations')->updateOrInsert(
                ['credit_category_id' => $toolingId, 'locale' => 'pt-BR'],
                ['name' => 'Ferramentas de desenvolvimento', 'updated_at' => now(), 'created_at' => now()],
            );

            $toolingUrls = [
                'https://github.com/casey/just',
                'https://github.com/',
                'https://github.com/features/actions',
                'https://nodejs.org/',
                'https://tectonic-typesetting.github.io/',
                'https://csharpier.com/',
                'https://prettier.io/',
                'https://github.com/kucherenko/jscpd',
                'https://github.com/mvdan/sh',
                'https://playwright.dev/',
                'https://github.com/dequelabs/axe-core',
                'https://developer.chrome.com/docs/lighthouse/',
            ];

            foreach (['credit_entries', 'credit_entry_revisions'] as $table) {
                DB::table($table)
                    ->where('category', 'infrastructure')
                    ->whereIn('url', $toolingUrls)
                    ->update(['category' => 'tooling', 'updated_at' => now()]);
            }
        });
    }

    public function down(): void
    {
        DB::transaction(function (): void {
            $toolingUrls = [
                'https://github.com/casey/just',
                'https://github.com/',
                'https://github.com/features/actions',
                'https://nodejs.org/',
                'https://tectonic-typesetting.github.io/',
                'https://csharpier.com/',
                'https://prettier.io/',
                'https://github.com/kucherenko/jscpd',
                'https://github.com/mvdan/sh',
                'https://playwright.dev/',
                'https://github.com/dequelabs/axe-core',
                'https://developer.chrome.com/docs/lighthouse/',
            ];

            foreach (['credit_entries', 'credit_entry_revisions'] as $table) {
                DB::table($table)
                    ->where('category', 'tooling')
                    ->whereIn('url', $toolingUrls)
                    ->update(['category' => 'infrastructure', 'updated_at' => now()]);
            }

            $toolingId = DB::table('credit_categories')->where('slug', 'tooling')->value('id');

            if ($toolingId !== null) {
                DB::table('credit_category_translations')->where('credit_category_id', $toolingId)->delete();
                DB::table('credit_categories')->where('id', $toolingId)->delete();
            }

            $infrastructureId = DB::table('credit_categories')->where('slug', 'infrastructure')->value('id');

            if ($infrastructureId !== null) {
                DB::table('credit_category_translations')
                    ->where('credit_category_id', $infrastructureId)
                    ->where('locale', 'en')
                    ->update(['name' => 'Infrastructure and tooling', 'updated_at' => now()]);
                DB::table('credit_category_translations')
                    ->where('credit_category_id', $infrastructureId)
                    ->where('locale', 'pt-BR')
                    ->update(['name' => 'Infraestrutura e ferramentas', 'updated_at' => now()]);
            }
        });
    }
};
