<?php

namespace Tests\Feature\Models;

use App\Content\EditorialRevisionPublisher;
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

    public function test_publishing_without_reading_time_preserves_the_existing_value(): void
    {
        $writing = Writing::factory()->create(['hidden' => false]);
        WritingRevisionTranslation::factory()->create([
            'writing_id' => $writing->id,
            'locale' => 'en',
            'reading_time' => '5 min',
        ]);
        $writing->refresh();

        app(EditorialRevisionPublisher::class)->publish($writing, [
            'en' => [
                'title' => 'Updated title',
                'body' => 'Updated body',
            ],
        ]);

        $this->assertSame('5 min', $writing->refresh()->translation('en')?->getAttribute('reading_time'));
    }
}
