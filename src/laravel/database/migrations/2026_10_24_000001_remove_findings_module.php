<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function (): void {
            $resourceIds = DB::table('resources')->pluck('id');

            if ($resourceIds->isNotEmpty()) {
                DB::table('content_relations')
                    ->where(function ($query): void {
                        $query
                            ->where(function ($subject): void {
                                $subject->where('subject_type', 'finding');
                            })
                            ->orWhere(function ($object): void {
                                $object->where('object_type', 'finding');
                            });
                    })
                    ->delete();
                DB::table('topicables')->where('topicable_type', 'finding')->delete();
                DB::table('reference_collection_revision_resources')->whereIn('resource_id', $resourceIds)->delete();
                DB::table('reference_collection_item')->whereIn('resource_id', $resourceIds)->delete();
            }

            foreach ([
                'reference_collection_item',
                'reference_collection_revision_resources',
                'resource_revision_type_details',
                'resource_revision_attributions',
                'resource_revision_collections',
                'resource_revision_topics',
                'resource_revision_identifiers',
                'resource_revision_links',
                'resource_revision_translations',
                'resource_revisions',
                'resource_identifiers',
                'resource_links',
                'resource_translations',
                'resources',
            ] as $table) {
                Schema::dropIfExists($table);
            }
        });
    }

    public function down(): void {}
};
