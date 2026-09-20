<?php

namespace Tests\Feature\Models;

use App\Models\Resource;
use App\Models\ResourceLink;
use App\Models\ResourceTranslation;
use App\Models\Topic;
use Tests\TestCase;

class ResourceTest extends TestCase
{
    public function test_can_create_resource(): void
    {
        $resource = Resource::factory()->create();

        $this->assertInstanceOf(Resource::class, $resource);
        $this->assertNotNull($resource->id);
        $this->assertNotNull($resource->slug);
    }

    public function test_resource_has_translations_links_and_topics(): void
    {
        $resource = Resource::factory()->create();
        ResourceTranslation::factory()->create(['resource_id' => $resource->id]);
        ResourceLink::factory()->create(['resource_id' => $resource->id]);
        $topic = Topic::factory()->create();
        $resource->topics()->attach($topic);

        $this->assertCount(1, $resource->translations);
        $this->assertCount(1, $resource->links);
        $this->assertCount(1, $resource->topics);
    }
}
