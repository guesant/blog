<?php

namespace Database\Factories;

use App\Models\Writing;
use App\Models\WritingTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class WritingTranslationFactory extends Factory
{
    protected $model = WritingTranslation::class;

    public function definition(): array
    {
        return [
            'writing_id' => Writing::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'excerpt' => $this->faker->optional()->paragraph(),
            'reading_time' => $this->faker->optional()->word(),
            'body' => $this->faker->optional()->paragraph(),
            'seo' => null,
        ];
    }
}
