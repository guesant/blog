<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectTranslationFactory extends Factory
{
    protected $model = ProjectTranslation::class;

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
            'metrics' => null,
            'body' => $this->faker->optional()->paragraph(),
            'seo' => null,
        ];
    }
}
