<?php

namespace Tests\Feature\Models;

use App\Models\RelationType;
use Tests\TestCase;

class RelationTypeTest extends TestCase
{
    public function test_can_create_relation_type(): void
    {
        $relationType = RelationType::factory()->create();

        $this->assertInstanceOf(RelationType::class, $relationType);
        $this->assertNotNull($relationType->id);
        $this->assertNotNull($relationType->key);
        $this->assertCount(2, $relationType->translations);
        $this->assertNotNull($relationType->translation('en'));
        $this->assertNotNull($relationType->translation('pt-BR'));
    }
}
