<?php

namespace Database\Factories;

use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

class TopicFactory extends Factory
{
    protected $model = Topic::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'order' => $this->faker->numberBetween(1, 100),
            'kind' => $this->faker->randomElement(['topic', 'category']),
            'parent_id' => null,
        ];
    }
}
