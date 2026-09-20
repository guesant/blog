<?php

namespace Database\Factories;

use App\Models\CaseStudy;
use Illuminate\Database\Eloquent\Factories\Factory;

class CaseStudyFactory extends Factory
{
    protected $model = CaseStudy::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'hidden' => $this->faker->boolean(),
            'order' => $this->faker->numberBetween(1, 100),
            'href' => $this->faker->optional()->url(),
            'external' => $this->faker->boolean(),
            'visual' => $this->faker->optional()->slug().'.jpg',
        ];
    }
}
