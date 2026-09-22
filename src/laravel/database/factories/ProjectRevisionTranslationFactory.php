<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectRevision;
use App\Models\ProjectRevisionTranslation;

class ProjectRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = ProjectRevisionTranslation::class;

    protected string $identityClass = Project::class;

    protected string $revisionClass = ProjectRevision::class;

    protected string $identityKey = 'project_id';

    protected string $revisionKey = 'project_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'nda', 'published_at', 'show_history'];

    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
            'purpose' => $this->faker->paragraph(),
            'problem' => $this->faker->optional()->paragraph(),
            'current_focus' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->optional()->word(),
            'body' => $this->faker->optional()->paragraph(),
        ];
    }
}
