<?php

namespace Tests\Feature\Models;

use App\Models\Topic;
use App\Models\Writing;
use App\Models\WritingRevisionTranslation;
use Tests\TestCase;

class WritingTest extends TestCase
{
    public function test_can_create_writing(): void
    {
        $writing = Writing::factory()->create();

        $this->assertInstanceOf(Writing::class, $writing);
        $this->assertNotNull($writing->id);
        $this->assertNotNull($writing->slug);
    }

    public function test_writing_has_translations_and_topics(): void
    {
        $writing = Writing::factory()->create();
        WritingRevisionTranslation::factory()->create(['writing_id' => $writing->id]);
        $writing->refresh();
        $topic = Topic::factory()->create();
        $writing->topics()->attach($topic);

        $this->assertCount(1, $writing->translations);
        $this->assertCount(1, $writing->topics);
    }
}
