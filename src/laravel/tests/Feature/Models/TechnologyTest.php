<?php

namespace Tests\Feature\Models;

use App\Models\Technology;
use App\Models\TechnologyRevisionTranslation;
use Tests\TestCase;

class TechnologyTest extends TestCase
{
    public function test_can_create_technology(): void
    {
        $technology = Technology::factory()->create();

        $this->assertInstanceOf(Technology::class, $technology);
        $this->assertNotNull($technology->id);
        $this->assertNotNull($technology->slug);
    }

    public function test_technology_has_translations(): void
    {
        $technology = Technology::factory()->create();
        TechnologyRevisionTranslation::factory()->create(['technology_id' => $technology->id]);
        $technology->refresh();

        $this->assertCount(1, $technology->translations);
        $this->assertInstanceOf(TechnologyRevisionTranslation::class, $technology->translations->first());
    }
}
