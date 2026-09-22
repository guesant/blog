<?php

namespace Database\Factories;

use App\Models\Experiment;
use App\Models\ExperimentTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExperimentTranslationFactory extends Factory
{
    protected $model = ExperimentTranslation::class;

    public function definition(): array
    {
        return [
            'experiment_id' => Experiment::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
            'purpose' => $this->faker->paragraph(),
            'body' => $this->faker->optional()->paragraph(),
        ];
    }
}
