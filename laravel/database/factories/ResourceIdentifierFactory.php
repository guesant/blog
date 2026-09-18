<?php

namespace Database\Factories;

use App\Models\Resource;
use App\Models\ResourceIdentifier;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResourceIdentifierFactory extends Factory
{
    protected $model = ResourceIdentifier::class;

    public function definition(): array
    {
        return [
            'resource_id' => Resource::factory(),
            'kind' => $this->faker->word(),
            'value' => $this->faker->unique()->slug(),
        ];
    }
}
