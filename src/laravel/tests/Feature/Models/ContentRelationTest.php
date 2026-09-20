<?php

namespace Tests\Feature\Models;

use App\Models\ContentRelation;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\Writing;
use Tests\TestCase;

class ContentRelationTest extends TestCase
{
    public function test_can_create_content_relation(): void
    {
        $relation = ContentRelation::factory()->create();

        $this->assertInstanceOf(ContentRelation::class, $relation);
        $this->assertNotNull($relation->id);
        $this->assertNotNull($relation->relation_type_id);
    }

    public function test_content_relation_has_relation_type(): void
    {
        $relationType = RelationType::factory()->create();
        $relation = ContentRelation::factory()->create(['relation_type_id' => $relationType->id]);

        $this->assertInstanceOf(RelationType::class, $relation->relationType);
    }

    public function test_subject_and_object_resolve_to_underlying_models(): void
    {
        $relation = ContentRelation::factory()->create();

        $this->assertInstanceOf(Resource::class, $relation->subject);
        $this->assertInstanceOf(Resource::class, $relation->object);
    }

    public function test_subject_resolves_across_different_morph_kinds(): void
    {
        $writing = Writing::factory()->create();

        $relation = ContentRelation::factory()->create([
            'subject_type' => 'writing',
            'subject_id' => $writing->id,
        ]);

        $this->assertInstanceOf(Writing::class, $relation->subject);
        $this->assertTrue($relation->subject->is($writing));
    }
}
