<?php

namespace Database\Factories;

use App\Models\RelationType;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelationTypeFactory extends Factory
{
    protected $model = RelationType::class;

    public function definition(): array
    {
        return [
            'key' => $this->faker->unique()->slug(),
            'family' => $this->faker->word(),
            'symmetric' => $this->faker->boolean(),
            'outbound_label_en' => $this->faker->sentence(3),
            'outbound_label_pt_br' => $this->faker->sentence(3),
            'inbound_label_en' => $this->faker->sentence(3),
            'inbound_label_pt_br' => $this->faker->sentence(3),
        ];
    }
}
