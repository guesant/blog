<?php

namespace App\Content;

use App\Models\Resource;
use App\Models\ResourceRevision;
use App\Models\ResourceTranslation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ResourceRevisionSynchronizer
{
    public const SKIP_NEXT_SAVE = 'resource_revision_synchronizer.skip_next_save';

    public function saved(Model $model): void
    {
        if (app()->bound(self::SKIP_NEXT_SAVE)) {
            app()->forgetInstance(self::SKIP_NEXT_SAVE);

            return;
        }

        $resource = $model instanceof Resource
            ? $model
            : ($model instanceof ResourceTranslation ? $model->resource : null);

        if ($resource === null) {
            return;
        }

        DB::transaction(fn (): ResourceRevision => $this->sync($resource));
    }

    private function sync(Resource $resource): ResourceRevision
    {
        $revisionNumber = ((int) ResourceRevision::query()
            ->where('resource_id', $resource->id)
            ->max('revision_number')) + 1;

        $revision = ResourceRevision::query()->create([
            'resource_id' => $resource->id,
            'revision_number' => $revisionNumber,
            'slug' => $resource->slug,
            'public_id' => $resource->public_id,
            'hidden' => $resource->hidden,
            'order' => $resource->order,
            'type' => $resource->type,
            'language_id' => $resource->language_id,
            'published_date_iso' => $resource->published_date_iso,
            'found_date_iso' => $resource->found_date_iso,
            'consumption_state' => $resource->consumption_state,
            'rating' => $resource->rating,
            'editorial_state' => $resource->editorial_state,
            'visibility' => $resource->visibility,
            'featured' => $resource->featured,
            'featured_order' => $resource->featured_order,
            'popularity_kind' => $resource->popularity_kind,
            'popularity_rank' => $resource->popularity_rank,
            'popularity_refreshed_at' => $resource->popularity_refreshed_at,
            'popularity_value' => $resource->popularity_value,
            'created_by' => auth()->id(),
        ]);

        $this->syncTranslations($resource, $revision);
        $this->syncLinks($resource, $revision);
        $this->syncIdentifiers($resource, $revision);
        $this->syncTopics($resource, $revision);
        $this->syncCollections($resource, $revision);

        $resource->forceFill([
            'current_revision_id' => $revision->id,
            'published_revision_id' => $this->isPublic($resource) ? $revision->id : null,
        ])->saveQuietly();

        DB::table('content_publications')
            ->where('content_type', 'resources')
            ->where('content_id', $resource->id)
            ->whereNull('unpublished_at')
            ->update(['unpublished_at' => now()]);

        if ($this->isPublic($resource)) {
            DB::table('content_publications')->insert([
                'content_type' => 'resources',
                'content_id' => $resource->id,
                'revision_id' => $revision->id,
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);
        }

        return $revision;
    }

    private function syncTranslations(Resource $resource, ResourceRevision $revision): void
    {
        foreach ($resource->translations()->get() as $translation) {
            $revision->translations()->create([
                'locale' => $translation->locale,
                'title' => $translation->title,
                'alternative_title' => $translation->alternative_title,
                'description' => $translation->description,
                'personal_note' => $translation->personal_note,
                'reason_found' => $translation->reason_found,
            ]);
        }
    }

    private function syncLinks(Resource $resource, ResourceRevision $revision): void
    {
        foreach ($resource->links()->get() as $link) {
            $revision->links()->create([
                'url' => $link->url,
                'label' => $link->label,
                'platform' => $link->platform,
                'purpose' => $link->purpose,
                'is_primary' => $link->is_primary,
                'is_free' => $link->is_free,
                'language_id' => $link->language_id,
            ]);
        }
    }

    private function syncIdentifiers(Resource $resource, ResourceRevision $revision): void
    {
        foreach ($resource->identifiers()->get() as $identifier) {
            $revision->identifiers()->create([
                'kind' => $identifier->kind,
                'value' => $identifier->value,
            ]);
        }
    }

    private function syncTopics(Resource $resource, ResourceRevision $revision): void
    {
        foreach ($resource->topics()->get() as $topic) {
            DB::table('resource_revision_topics')->insert([
                'resource_revision_id' => $revision->id,
                'topic_id' => $topic->id,
                'role' => $topic->pivot->role,
            ]);
        }
    }

    private function syncCollections(Resource $resource, ResourceRevision $revision): void
    {
        foreach ($resource->referenceCollections()->get() as $collection) {
            DB::table('resource_revision_collections')->insert([
                'resource_revision_id' => $revision->id,
                'reference_collection_id' => $collection->id,
                'note' => $collection->pivot->note,
                'sort_order' => $collection->pivot->order,
            ]);
        }
    }

    private function isPublic(Resource $resource): bool
    {
        return ! $resource->hidden && $resource->visibility === 'public';
    }
}
