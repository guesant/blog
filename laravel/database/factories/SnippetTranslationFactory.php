<?php

namespace Database\Factories;

use App\Models\Snippet;
use App\Models\SnippetTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class SnippetTranslationFactory extends Factory
{
    protected $model = SnippetTranslation::class;

    public function definition(): array
    {
        return [
            'snippet_id' => Snippet::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->optional()->paragraph(),
        ];
    }
}
