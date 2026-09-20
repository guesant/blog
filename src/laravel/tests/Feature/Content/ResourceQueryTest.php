<?php

namespace Tests\Feature\Content;

use App\Content\ResourceQuery;
use App\Models\ContentRelation;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\ResourceTranslation;
use Tests\TestCase;

class ResourceQueryTest extends TestCase
{
    public function test_find_by_slug_returns_resource_with_relations(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'depends-on',
            'symmetric' => false,
            'outbound_label_en' => 'depends on',
            'outbound_label_pt_br' => 'depende de',
            'inbound_label_en' => 'is depended on by',
            'inbound_label_pt_br' => 'é dependência de',
        ]);

        $resourceA = Resource::factory()->create(['slug' => 'resource-a', 'hidden' => false, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceA->id, 'locale' => 'en', 'title' => 'Resource A']);

        $resourceB = Resource::factory()->create(['slug' => 'resource-b', 'hidden' => false, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceB->id, 'locale' => 'en', 'title' => 'Resource B']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $resourceA->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $resourceB->id,
            'note' => 'test note',
        ]);

        $result = (new ResourceQuery)->findBySlug('resource-a', 'en');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('resource', $result);
        $this->assertArrayHasKey('relations', $result);
        $this->assertEquals('resource-a', $result['resource']->slug);
        $this->assertCount(1, $result['relations']);

        $outboundRelation = $result['relations'][0];
        $this->assertEquals('outbound', $outboundRelation['direction']);
        $this->assertEquals('depends on', $outboundRelation['label']);
        $this->assertStringContainsString('resource-b', $outboundRelation['targetUrl']);
        $this->assertEquals('Resource B', $outboundRelation['targetTitle']);
    }

    public function test_inbound_relations_use_correct_label(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'depends-on',
            'symmetric' => false,
            'outbound_label_en' => 'depends on',
            'inbound_label_en' => 'is depended on by',
        ]);

        $resourceA = Resource::factory()->create(['slug' => 'resource-a', 'hidden' => false, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceA->id, 'locale' => 'en', 'title' => 'Resource A']);

        $resourceB = Resource::factory()->create(['slug' => 'resource-b', 'hidden' => false, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceB->id, 'locale' => 'en', 'title' => 'Resource B']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $resourceA->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $resourceB->id,
        ]);

        $result = (new ResourceQuery)->findBySlug('resource-b', 'en');

        $this->assertIsArray($result);
        $this->assertCount(1, $result['relations']);

        $inboundRelation = $result['relations'][0];
        $this->assertEquals('inbound', $inboundRelation['direction']);
        $this->assertEquals('is depended on by', $inboundRelation['label']);
        $this->assertStringContainsString('resource-a', $inboundRelation['targetUrl']);
    }

    public function test_hidden_target_resource_is_excluded(): void
    {
        $relationType = RelationType::factory()->create(['key' => 'depends-on']);

        $resourceA = Resource::factory()->create(['slug' => 'resource-a', 'hidden' => false, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceA->id, 'locale' => 'en']);

        $resourceB = Resource::factory()->create(['slug' => 'resource-b', 'hidden' => true, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceB->id, 'locale' => 'en']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $resourceA->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $resourceB->id,
        ]);

        $result = (new ResourceQuery)->findBySlug('resource-a', 'en');

        $this->assertIsArray($result);
        $this->assertCount(0, $result['relations']);
    }

    public function test_non_public_visibility_target_is_excluded(): void
    {
        $relationType = RelationType::factory()->create(['key' => 'depends-on']);

        $resourceA = Resource::factory()->create(['slug' => 'resource-a', 'hidden' => false, 'visibility' => 'public']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceA->id, 'locale' => 'en']);

        $resourceB = Resource::factory()->create(['slug' => 'resource-b', 'hidden' => false, 'visibility' => 'private']);
        ResourceTranslation::factory()->create(['resource_id' => $resourceB->id, 'locale' => 'en']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $resourceA->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $resourceB->id,
        ]);

        $result = (new ResourceQuery)->findBySlug('resource-a', 'en');

        $this->assertIsArray($result);
        $this->assertCount(0, $result['relations']);
    }
}
