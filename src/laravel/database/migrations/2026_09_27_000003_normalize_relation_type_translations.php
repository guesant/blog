<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('relation_type_translations')) {
            Schema::create('relation_type_translations', function (Blueprint $table): void {
                $table->increments('id');
                $table->unsignedInteger('relation_type_id');
                $table->string('locale', 16);
                $table->text('outbound_label');
                $table->text('inbound_label');
                $table->timestamps();
                $table->unique(['relation_type_id', 'locale']);
                $table->foreign('relation_type_id')->references('id')->on('relation_types')->cascadeOnDelete();
            });
        }

        if (Schema::hasColumn('relation_types', 'outbound_label_en')) {
            DB::table('relation_types')->orderBy('id')->each(function (object $relationType): void {
                foreach ([
                    'en' => ['outbound_label_en', 'inbound_label_en'],
                    'pt-BR' => ['outbound_label_pt_br', 'inbound_label_pt_br'],
                ] as $locale => [$outboundColumn, $inboundColumn]) {
                    DB::table('relation_type_translations')->updateOrInsert(
                        [
                            'relation_type_id' => $relationType->id,
                            'locale' => $locale,
                        ],
                        [
                            'outbound_label' => $relationType->{$outboundColumn},
                            'inbound_label' => $relationType->{$inboundColumn},
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    );
                }
            });

            Schema::table('relation_types', function (Blueprint $table): void {
                $table->dropColumn([
                    'outbound_label_en',
                    'outbound_label_pt_br',
                    'inbound_label_en',
                    'inbound_label_pt_br',
                ]);
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('relation_types', 'outbound_label_en')) {
            Schema::table('relation_types', function (Blueprint $table): void {
                $table->text('outbound_label_en')->nullable();
                $table->text('outbound_label_pt_br')->nullable();
                $table->text('inbound_label_en')->nullable();
                $table->text('inbound_label_pt_br')->nullable();
            });
        }

        DB::table('relation_types')->orderBy('id')->each(function (object $relationType): void {
            $translations = DB::table('relation_type_translations')
                ->where('relation_type_id', $relationType->id)
                ->get()
                ->keyBy('locale');

            DB::table('relation_types')
                ->where('id', $relationType->id)
                ->update([
                    'outbound_label_en' => $translations->get('en')?->outbound_label,
                    'outbound_label_pt_br' => $translations->get('pt-BR')?->outbound_label,
                    'inbound_label_en' => $translations->get('en')?->inbound_label,
                    'inbound_label_pt_br' => $translations->get('pt-BR')?->inbound_label,
                ]);
        });

        Schema::dropIfExists('relation_type_translations');
    }
};
