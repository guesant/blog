<?php

namespace Tests\Feature\Models;

use App\Models\Experiment;
use App\Models\ExperimentTranslation;
use App\Models\Technology;
use Tests\TestCase;

class ExperimentTest extends TestCase
{
    public function test_can_create_experiment(): void
    {
        $experiment = Experiment::factory()->create();

        $this->assertInstanceOf(Experiment::class, $experiment);
        $this->assertNotNull($experiment->id);
        $this->assertNotNull($experiment->slug);
    }

    public function test_experiment_has_translations_and_technologies(): void
    {
        $experiment = Experiment::factory()->create();
        ExperimentTranslation::factory()->create(['experiment_id' => $experiment->id]);
        $technology = Technology::factory()->create();
        $experiment->technologies()->attach($technology);

        $this->assertCount(1, $experiment->translations);
        $this->assertCount(1, $experiment->technologies);
    }
}
