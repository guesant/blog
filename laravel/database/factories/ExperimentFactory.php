<?php

namespace Database\Factories;

use App\Models\Experiment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExperimentFactory extends Factory
{
    protected $model = Experiment::class;

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
