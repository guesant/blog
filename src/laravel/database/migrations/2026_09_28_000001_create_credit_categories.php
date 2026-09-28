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
        Schema::create('credit_categories', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('slug', 255)->unique();
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('credit_category_translations', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('credit_category_id');
            $table->string('locale', 16);
            $table->string('name');
            $table->timestamps();
            $table->unique(['credit_category_id', 'locale']);
            $table->foreign('credit_category_id')->references('id')->on('credit_categories')->cascadeOnDelete();
        });

        $categories = [
            'reference' => ['en' => 'References', 'pt-BR' => 'Referências'],
            'infrastructure' => ['en' => 'Infrastructure and tooling', 'pt-BR' => 'Infraestrutura e ferramentas'],
            'font' => ['en' => 'Fonts', 'pt-BR' => 'Fontes'],
            'library' => ['en' => 'Libraries', 'pt-BR' => 'Bibliotecas'],
            'tool' => ['en' => 'Tools', 'pt-BR' => 'Ferramentas'],
        ];

        $slugs = collect(array_keys($categories));

        foreach (['credit_entries', 'credit_entry_revisions'] as $table) {
            if (! Schema::hasTable($table) || ! Schema::hasColumn($table, 'category')) {
                continue;
            }

            $slugs = $slugs->merge(DB::table($table)->whereNotNull('category')->pluck('category'));
        }

        foreach ($slugs->filter()->map(fn (mixed $slug): string => (string) $slug)->unique() as $slug) {
            $category = $categories[$slug] ?? [
                'en' => Str::headline($slug),
                'pt-BR' => Str::headline($slug),
            ];

            $categoryId = DB::table('credit_categories')->insertGetId([
                'slug' => $slug,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($category as $locale => $name) {
                DB::table('credit_category_translations')->insert([
                    'credit_category_id' => $categoryId,
                    'locale' => $locale,
                    'name' => $name,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_category_translations');
        Schema::dropIfExists('credit_categories');
    }
};
