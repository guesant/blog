<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\ProfileTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileTranslationFactory extends Factory
{
    protected $model = ProfileTranslation::class;

    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->optional()->word(),
            'location' => $this->faker->optional()->city(),
            'birth_city' => $this->faker->optional()->city(),
            'description' => $this->faker->optional()->paragraph(),
            'interests' => $this->faker->optional()->paragraph(),
            'learning' => $this->faker->optional()->paragraph(),
        ];
    }
}
