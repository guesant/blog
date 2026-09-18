<?php

namespace Tests\Feature\Models;

use App\Models\Project;
use App\Models\ProjectTranslation;
use App\Models\Technology;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    public function test_can_create_project(): void
    {
        $project = Project::factory()->create();

        $this->assertInstanceOf(Project::class, $project);
        $this->assertNotNull($project->id);
        $this->assertNotNull($project->slug);
    }

    public function test_project_has_translations_and_technologies(): void
    {
        $project = Project::factory()->create();
        ProjectTranslation::factory()->create(['project_id' => $project->id]);
        $technology = Technology::factory()->create();
        $project->technologies()->attach($technology);

        $this->assertCount(1, $project->translations);
        $this->assertCount(1, $project->technologies);
    }
}
