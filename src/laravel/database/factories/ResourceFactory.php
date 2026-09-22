<?php

namespace Database\Factories;

use App\Models\Resource;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceFactory extends Factory
{
    protected $model = Resource::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'hidden' => $this->faker->boolean(),
            'order' => $this->faker->numberBetween(1, 100),
            'type' => $this->faker->word(),
            'language_id' => null,
            'published_date_iso' => $this->faker->optional()->date(),
            'found_date_iso' => $this->faker->optional()->date(),
            'consumption_state' => $this->faker->optional()->word(),
            'rating' => $this->faker->optional()->word(),
            'editorial_state' => $this->faker->optional()->word(),
            'visibility' => $this->faker->optional()->word(),
        ];
    }
}
