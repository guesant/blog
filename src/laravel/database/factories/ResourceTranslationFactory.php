<?php

namespace Database\Factories;

use App\Models\Resource;
use App\Models\ResourceTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceTranslationFactory extends Factory
{
    protected $model = ResourceTranslation::class;

    public function definition(): array
    {
        return [
            'resource_id' => Resource::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'alternative_title' => $this->faker->optional()->sentence(),
            'description' => $this->faker->optional()->paragraph(),
            'personal_note' => $this->faker->optional()->paragraph(),
            'reason_found' => $this->faker->optional()->paragraph(),
        ];
    }
}
