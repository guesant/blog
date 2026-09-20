<?php

namespace Database\Factories;

use App\Models\Language;
use Illuminate\Database\Eloquent\Factories\Factory;

class LanguageFactory extends Factory
{
    protected $model = Language::class;

    public function definition(): array
    {
        return [
            'slug' => $this->faker->unique()->slug(),
            'order' => $this->faker->numberBetween(1, 100),
            'code' => $this->faker->locale(),
        ];
    }
}
