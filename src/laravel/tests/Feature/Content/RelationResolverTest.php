<?php

namespace Tests\Feature\Content;

use App\Content\Graph\RelationResolver;
use App\Models\ContentRelation;
use App\Models\RelationType;
use App\Models\Resource;
use App\Models\ResourceRevisionTranslation;
use App\Models\Technology;
use App\Models\TechnologyRevisionTranslation;
use App\Models\Writing;
use App\Models\WritingRevisionTranslation;
use Tests\TestCase;

class RelationResolverTest extends TestCase
{
    public function test_outbound_relation_uses_outbound_label(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'depends-on',
            'symmetric' => false,
            'outbound_label_en' => 'depends on',
            'inbound_label_en' => 'is depended on by',
        ]);

        $source = Resource::factory()->create(['slug' => 'source', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $source->id, 'locale' => 'en', 'title' => 'Source']);

        $target = Resource::factory()->create(['slug' => 'target', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $target->id, 'locale' => 'en', 'title' => 'Target']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $source->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $target->id,
        ]);

        $relations = (new RelationResolver)->for($source, 'en');

        $this->assertCount(1, $relations);
        $this->assertEquals('outbound', $relations[0]['direction']);
        $this->assertEquals('depends on', $relations[0]['label']);
        $this->assertEquals('Target', $relations[0]['targetTitle']);
    }

    public function test_inbound_relation_uses_inbound_label(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'depends-on',
            'symmetric' => false,
            'outbound_label_en' => 'depends on',
            'inbound_label_en' => 'is depended on by',
        ]);

        $source = Resource::factory()->create(['slug' => 'source', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $source->id, 'locale' => 'en', 'title' => 'Source']);

        $target = Resource::factory()->create(['slug' => 'target', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $target->id, 'locale' => 'en', 'title' => 'Target']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $source->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $target->id,
        ]);

        $relations = (new RelationResolver)->for($target, 'en');

        $this->assertCount(1, $relations);
        $this->assertEquals('inbound', $relations[0]['direction']);
        $this->assertEquals('is depended on by', $relations[0]['label']);
        $this->assertEquals('Source', $relations[0]['targetTitle']);
    }

    public function test_symmetric_relation_uses_outbound_label_on_both_ends(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'related-to',
            'symmetric' => true,
            'outbound_label_en' => 'related to',
            'inbound_label_en' => 'should never be used',
        ]);

        $a = Resource::factory()->create(['slug' => 'a', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $a->id, 'locale' => 'en', 'title' => 'A']);

        $b = Resource::factory()->create(['slug' => 'b', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $b->id, 'locale' => 'en', 'title' => 'B']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $a->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $b->id,
        ]);

        $fromA = (new RelationResolver)->for($a, 'en');
        $fromB = (new RelationResolver)->for($b, 'en');

        $this->assertEquals('related to', $fromA[0]['label']);
        $this->assertEquals('related to', $fromB[0]['label']);
    }

    public function test_cross_type_relation_resolves_on_both_ends(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'cites',
            'symmetric' => false,
            'outbound_label_en' => 'cites',
            'inbound_label_en' => 'cited by',
        ]);

        $writing = Writing::factory()->create(['slug' => 'my-writing', 'hidden' => false]);
        WritingRevisionTranslation::factory()->create(['writing_id' => $writing->id, 'locale' => 'en', 'title' => 'My Writing']);

        $finding = Resource::factory()->create(['slug' => 'my-finding', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $finding->id, 'locale' => 'en', 'title' => 'My Finding']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Writing)->getMorphClass(),
            'subject_id' => $writing->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $finding->id,
        ]);

        $fromWriting = (new RelationResolver)->for($writing, 'en');
        $this->assertCount(1, $fromWriting);
        $this->assertEquals('outbound', $fromWriting[0]['direction']);
        $this->assertEquals('finding', $fromWriting[0]['targetKind']);
        $this->assertEquals('My Finding', $fromWriting[0]['targetTitle']);
        $this->assertStringContainsString('my-finding', $fromWriting[0]['targetUrl']);

        $fromFinding = (new RelationResolver)->for($finding, 'en');
        $this->assertCount(1, $fromFinding);
        $this->assertEquals('inbound', $fromFinding[0]['direction']);
        $this->assertEquals('writing', $fromFinding[0]['targetKind']);
        $this->assertEquals('My Writing', $fromFinding[0]['targetTitle']);
        $this->assertStringContainsString('my-writing', $fromFinding[0]['targetUrl']);
    }

    public function test_hidden_target_is_excluded(): void
    {
        $relationType = RelationType::factory()->create(['key' => 'depends-on']);

        $source = Resource::factory()->create(['slug' => 'source', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $source->id, 'locale' => 'en']);

        $target = Resource::factory()->create(['slug' => 'target', 'hidden' => true, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $target->id, 'locale' => 'en']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $source->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $target->id,
        ]);

        $relations = (new RelationResolver)->for($source, 'en');

        $this->assertCount(0, $relations);
    }

    public function test_private_relation_is_excluded(): void
    {
        $relationType = RelationType::factory()->create(['key' => 'depends-on']);

        $source = Resource::factory()->create(['slug' => 'source', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $source->id, 'locale' => 'en']);

        $target = Resource::factory()->create(['slug' => 'target', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $target->id, 'locale' => 'en']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $source->id,
            'object_type' => (new Resource)->getMorphClass(),
            'object_id' => $target->id,
            'visibility' => 'private',
        ]);

        $relations = (new RelationResolver)->for($source, 'en');

        $this->assertCount(0, $relations);
    }

    public function test_technology_target_resolves_its_graph_url(): void
    {
        $relationType = RelationType::factory()->create([
            'key' => 'uses',
            'symmetric' => false,
            'outbound_label_en' => 'uses',
            'inbound_label_en' => 'used by',
        ]);

        $finding = Resource::factory()->create(['slug' => 'a-finding', 'hidden' => false, 'visibility' => 'public']);
        ResourceRevisionTranslation::factory()->create(['resource_id' => $finding->id, 'locale' => 'en', 'title' => 'A Finding']);

        $technology = Technology::factory()->create(['slug' => 'php']);
        TechnologyRevisionTranslation::factory()->create(['technology_id' => $technology->id, 'locale' => 'en', 'name' => 'PHP']);

        ContentRelation::factory()->create([
            'relation_type_id' => $relationType->id,
            'subject_type' => (new Resource)->getMorphClass(),
            'subject_id' => $finding->id,
            'object_type' => (new Technology)->getMorphClass(),
            'object_id' => $technology->id,
        ]);

        $relations = (new RelationResolver)->for($finding, 'en');

        $this->assertCount(1, $relations);
        $this->assertEquals('technology', $relations[0]['targetKind']);
        $this->assertEquals('PHP', $relations[0]['targetTitle']);
        $this->assertEquals($technology->graphUrl('en'), $relations[0]['targetUrl']);
    }
}
