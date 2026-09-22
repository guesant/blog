<?php

namespace Tests\Feature\Content;

use App\Content\WritingQuery;
use App\Models\Writing;
use App\Models\WritingRevisionTranslation;
use Tests\TestCase;

class WritingQueryTest extends TestCase
{
    public function test_list_returns_only_non_hidden_ordered_by_date_desc(): void
    {
        $older = Writing::factory()->create(['slug' => 'older', 'hidden' => false, 'date_iso' => '2024-01-01']);
        WritingRevisionTranslation::factory()->create(['writing_id' => $older->id, 'locale' => 'en']);

        $newer = Writing::factory()->create(['slug' => 'newer', 'hidden' => false, 'date_iso' => '2024-12-31']);
        WritingRevisionTranslation::factory()->create(['writing_id' => $newer->id, 'locale' => 'en']);

        $hidden = Writing::factory()->create(['slug' => 'hidden', 'hidden' => true, 'date_iso' => '2024-06-15']);
        WritingRevisionTranslation::factory()->create(['writing_id' => $hidden->id, 'locale' => 'en']);

        $result = (new WritingQuery)->listPaginated()->getCollection();

        $this->assertCount(2, $result);
        $this->assertEquals('newer', $result->first()->slug);
        $this->assertEquals('older', $result->last()->slug);
    }

    public function test_find_by_slug_returns_writing(): void
    {
        $writing = Writing::factory()->create(['slug' => 'test-writing', 'hidden' => false]);
        WritingRevisionTranslation::factory()->create(['writing_id' => $writing->id, 'locale' => 'en']);

        $result = (new WritingQuery)->findBySlug('test-writing');

        $this->assertNotNull($result);
        $this->assertEquals('test-writing', $result->slug);
    }

    public function test_find_by_slug_returns_null_for_hidden(): void
    {
        $writing = Writing::factory()->create(['slug' => 'hidden-writing', 'hidden' => true]);
        WritingRevisionTranslation::factory()->create(['writing_id' => $writing->id, 'locale' => 'en']);

        $result = (new WritingQuery)->findBySlug('hidden-writing');

        $this->assertNull($result);
    }
}
