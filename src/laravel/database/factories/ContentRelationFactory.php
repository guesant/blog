<?php

namespace Database\Factories;

use App\Models\ContentRelation;
use App\Models\RelationType;
use App\Models\Resource;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContentRelationFactory extends Factory
{
    protected $model = ContentRelation::class;

    public function definition(): array
    {
        return [
            'relation_type_id' => RelationType::factory(),
            'subject_type' => 'finding',
            'subject_id' => Resource::factory(),
            'object_type' => 'finding',
            'object_id' => Resource::factory(),
            'note' => $this->faker->optional()->paragraph(),
            'context' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->optional($weight = 0.7, 'verified')->randomElement(['verified', 'pending', 'rejected']),
            'visibility' => null,
        ];
    }
}
