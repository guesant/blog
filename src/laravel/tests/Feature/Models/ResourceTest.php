<?php

namespace Tests\Feature\Models;

use App\Models\Resource;
use App\Models\ResourceLink;
use App\Models\ResourceRevisionTranslation;
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

    public function test_assigns_the_next_order_when_a_resource_is_created_without_one(): void
    {
        Resource::factory()->create(['order' => 7]);

        $resource = Resource::factory()->create(['order' => null]);

        $this->assertSame(8, $resource->order);
    }

    public function test_resource_has_translations_links_and_topics(): void
    {
        $resource = Resource::factory()->create();
        ResourceRevisionTranslation::factory()->create(['resource_id' => $resource->id]);
        $resource->refresh();
        ResourceLink::factory()->create(['resource_id' => $resource->id]);
        $topic = Topic::factory()->create();
        $resource->topics()->attach($topic);

        $this->assertCount(1, $resource->translations);
        $this->assertCount(1, $resource->links);
        $this->assertCount(1, $resource->topics);
    }
}
