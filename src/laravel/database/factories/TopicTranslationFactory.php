<?php

namespace Database\Factories;

use App\Models\Topic;
use App\Models\TopicTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class TopicTranslationFactory extends Factory
{
    protected $model = TopicTranslation::class;

    public function definition(): array
    {
        return [
            'topic_id' => Topic::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
        ];
    }
}
