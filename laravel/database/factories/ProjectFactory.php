<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'hidden' => $this->faker->boolean(),
            'order' => $this->faker->numberBetween(1, 100),
            'href' => $this->faker->optional()->url(),
            'external' => $this->faker->boolean(),
        ];
    }
}
