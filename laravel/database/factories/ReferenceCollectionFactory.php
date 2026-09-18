<?php

namespace Database\Factories;

use App\Models\ReferenceCollection;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReferenceCollectionFactory extends Factory
{
    protected $model = ReferenceCollection::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'hidden' => $this->faker->boolean(),
            'order' => $this->faker->numberBetween(1, 100),
            'image' => $this->faker->optional()->slug().'.jpg',
        ];
    }
}
