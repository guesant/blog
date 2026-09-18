<?php

namespace Database\Factories;

use App\Models\Technology;
use Illuminate\Database\Eloquent\Factories\Factory;

class TechnologyFactory extends Factory
{
    protected $model = Technology::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'order' => $this->faker->numberBetween(1, 100),
            'code' => $this->faker->optional()->word(),
            'logo' => $this->faker->optional()->slug().'.svg',
        ];
    }
}
