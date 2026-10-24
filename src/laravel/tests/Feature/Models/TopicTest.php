<?php

namespace Tests\Feature\Models;

use App\Models\Topic;
use App\Models\TopicRevisionTranslation;
use App\Models\Writing;
use Tests\TestCase;

class TopicTest extends TestCase
{
    public function test_can_create_topic(): void
    {
        $topic = Topic::factory()->create();

        $this->assertInstanceOf(Topic::class, $topic);
        $this->assertNotNull($topic->id);
        $this->assertNotNull($topic->slug);
    }

    public function test_topic_has_translations(): void
    {
        $topic = Topic::factory()->create();
        TopicRevisionTranslation::factory()->create(['topic_id' => $topic->id]);
        $topic->refresh();

        $this->assertCount(1, $topic->translations);
        $this->assertInstanceOf(TopicRevisionTranslation::class, $topic->translations->first());
    }

    public function test_topic_has_writings_through_topicables(): void
    {
        $topic = Topic::factory()->create();
        $writing = Writing::factory()->create();
        $topic->writings()->attach($writing);

        $this->assertCount(1, $topic->writings);
        $this->assertInstanceOf(Writing::class, $topic->writings->first());
    }
}
