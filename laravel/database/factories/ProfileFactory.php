<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->optional()->name(),
            'birth_date' => $this->faker->optional()->date(),
        ];
    }
}
