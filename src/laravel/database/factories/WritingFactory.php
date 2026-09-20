<?php

namespace Database\Factories;

use App\Models\Writing;
use Illuminate\Database\Eloquent\Factories\Factory;

class WritingFactory extends Factory
{
    protected $model = Writing::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'hidden' => $this->faker->boolean(),
            'date_iso' => $this->faker->optional()->date(),
            'type' => $this->faker->randomElement(['article', 'note', 'project-diary']),
        ];
    }
}
