<?php

namespace Tests\Feature\Models;

use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionTranslation;
use App\Models\Resource;
use Tests\TestCase;

class ReferenceCollectionTest extends TestCase
{
    public function test_can_create_reference_collection(): void
    {
        $collection = ReferenceCollection::factory()->create();

        $this->assertInstanceOf(ReferenceCollection::class, $collection);
        $this->assertNotNull($collection->id);
        $this->assertNotNull($collection->slug);
    }

    public function test_reference_collection_has_translations_and_resources(): void
    {
        $collection = ReferenceCollection::factory()->create();
        ReferenceCollectionTranslation::factory()->create(['reference_collection_id' => $collection->id]);
        $resource = Resource::factory()->create();
        $collection->resources()->attach($resource);

        $this->assertCount(1, $collection->translations);
        $this->assertCount(1, $collection->resources);
    }
}
