<?php

namespace Database\Factories;

use App\Models\Resource;
use App\Models\ResourceLink;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceLinkFactory extends Factory
{
    protected $model = ResourceLink::class;

    public function definition(): array
    {
        return [
            'resource_id' => Resource::factory(),
            'url' => $this->faker->url(),
            'label' => $this->faker->optional()->word(),
            'platform' => $this->faker->optional()->word(),
            'purpose' => $this->faker->optional()->word(),
            'is_primary' => $this->faker->boolean(),
            'is_free' => $this->faker->boolean(),
            'language_id' => null,
        ];
    }
}
