<?php

namespace Tests\Feature\Models;

use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionRevisionTranslation;
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

    public function test_reference_collection_has_translations(): void
    {
        $collection = ReferenceCollection::factory()->create();
        ReferenceCollectionRevisionTranslation::factory()->create(['reference_collection_id' => $collection->id]);
        $collection->refresh();
        $this->assertCount(1, $collection->translations);
    }
}
