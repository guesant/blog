<?php

namespace Database\Factories;

use App\Models\Snippet;
use Illuminate\Database\Eloquent\Factories\Factory;

class SnippetFactory extends Factory
{
    protected $model = Snippet::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'hidden' => false,
            'show_history' => false,
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }
}
