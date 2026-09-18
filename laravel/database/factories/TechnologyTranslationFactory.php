<?php

namespace Database\Factories;

use App\Models\Technology;
use App\Models\TechnologyTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class TechnologyTranslationFactory extends Factory
{
    protected $model = TechnologyTranslation::class;

    public function definition(): array
    {
        return [
            'technology_id' => Technology::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
        ];
    }
}
