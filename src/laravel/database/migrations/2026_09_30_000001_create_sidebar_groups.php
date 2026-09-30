<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sidebar_groups', function (Blueprint $table): void {
            $table->increments('id');
            $table->string('key', 100)->unique();
            $table->unsignedInteger('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        Schema::create('sidebar_group_translations', function (Blueprint $table): void {
            $table->increments('id');
            $table->unsignedInteger('sidebar_group_id');
            $table->string('locale', 16);
            $table->string('label');
            $table->timestamps();
            $table->unique(['sidebar_group_id', 'locale']);
            $table->foreign('sidebar_group_id')->references('id')->on('sidebar_groups')->cascadeOnDelete();
        });

        Schema::table('nav_items', function (Blueprint $table): void {
            $table->unsignedInteger('sidebar_group_id')->nullable()->index();
            $table->foreign('sidebar_group_id')->references('id')->on('sidebar_groups')->nullOnDelete();
        });

        Schema::table('nav_item_revisions', function (Blueprint $table): void {
            $table->unsignedInteger('sidebar_group_id')->nullable()->index();
            $table->foreign('sidebar_group_id')->references('id')->on('sidebar_groups')->nullOnDelete();
        });

        $defaults = [
            0 => ['key' => 'content', 'en' => 'Content', 'pt-BR' => 'Conteúdo'],
            1 => ['key' => 'explore', 'en' => 'Explore', 'pt-BR' => 'Explorar'],
            2 => ['key' => 'resources', 'en' => 'Resources', 'pt-BR' => 'Referências'],
            3 => ['key' => 'about', 'en' => 'About', 'pt-BR' => 'Sobre'],
        ];

        foreach ($defaults as $order => $default) {
            $this->createGroup($default['key'], $order, $default['en'], $default['pt-BR']);
        }

        $legacyGroups = DB::table('nav_items')
            ->whereNotNull('sidebar_group')
            ->distinct()
            ->orderBy('sidebar_group')
            ->pluck('sidebar_group');

        foreach ($legacyGroups as $legacyGroup) {
            $order = (int) $legacyGroup;
            $default = $defaults[$order] ?? [
                'key' => 'group-'.($order + 1),
                'en' => 'Group '.($order + 1),
                'pt-BR' => 'Grupo '.($order + 1),
            ];
            $group = DB::table('sidebar_groups')->where('key', $default['key'])->first();

            if ($group === null) {
                $this->createGroup($default['key'], $order, $default['en'], $default['pt-BR']);
                $group = DB::table('sidebar_groups')->where('key', $default['key'])->first();
            }

            DB::table('nav_items')
                ->where('sidebar_group', $legacyGroup)
                ->update(['sidebar_group_id' => $group->id]);

            DB::table('nav_item_revisions')
                ->where('sidebar_group', $legacyGroup)
                ->update(['sidebar_group_id' => $group->id]);
        }

        Schema::table('nav_items', function (Blueprint $table): void {
            $table->dropForeign(['sidebar_group_id']);
            $table->dropColumn('sidebar_group');
        });

        Schema::table('nav_item_revisions', function (Blueprint $table): void {
            $table->dropForeign(['sidebar_group_id']);
            $table->dropColumn('sidebar_group');
        });
    }

    public function down(): void
    {
        Schema::table('nav_items', function (Blueprint $table): void {
            $table->integer('sidebar_group')->nullable();
        });

        Schema::table('nav_item_revisions', function (Blueprint $table): void {
            $table->integer('sidebar_group')->nullable();
        });

        $groups = DB::table('sidebar_groups')->orderBy('order')->get(['id', 'order']);

        foreach ($groups as $group) {
            DB::table('nav_items')
                ->where('sidebar_group_id', $group->id)
                ->update(['sidebar_group' => $group->order]);
            DB::table('nav_item_revisions')
                ->where('sidebar_group_id', $group->id)
                ->update(['sidebar_group' => $group->order]);
        }

        Schema::table('nav_items', function (Blueprint $table): void {
            $table->dropForeign(['sidebar_group_id']);
            $table->dropColumn('sidebar_group_id');
        });

        Schema::table('nav_item_revisions', function (Blueprint $table): void {
            $table->dropForeign(['sidebar_group_id']);
            $table->dropColumn('sidebar_group_id');
        });

        Schema::dropIfExists('sidebar_group_translations');
        Schema::dropIfExists('sidebar_groups');
    }

    private function createGroup(string $key, int $order, string $english, string $portuguese): void
    {
        $id = DB::table('sidebar_groups')->insertGetId([
            'key' => $key,
            'order' => $order,
            'active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('sidebar_group_translations')->insert([
            [
                'sidebar_group_id' => $id,
                'locale' => 'en',
                'label' => $english,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'sidebar_group_id' => $id,
                'locale' => 'pt-BR',
                'label' => $portuguese,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
};
