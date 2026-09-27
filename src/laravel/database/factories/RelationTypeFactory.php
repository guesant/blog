<?php

namespace Database\Factories;

use App\Models\RelationType;
use App\Models\RelationTypeTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class RelationTypeFactory extends Factory
{
    protected $model = RelationType::class;

    public function configure(): static
    {
        return $this->afterCreating(function (RelationType $relationType): void {
            foreach ([
                'en' => ['outbound label', 'inbound label'],
                'pt-BR' => ['rótulo de saída', 'rótulo de entrada'],
            ] as $locale => [$outboundLabel, $inboundLabel]) {
                RelationTypeTranslation::create([
                    'relation_type_id' => $relationType->id,
                    'locale' => $locale,
                    'outbound_label' => $outboundLabel,
                    'inbound_label' => $inboundLabel,
                ]);
            }
        });
    }

    public function definition(): array
    {
        return [
            'key' => $this->faker->unique()->slug(),
            'family' => $this->faker->word(),
            'symmetric' => $this->faker->boolean(),
        ];
    }
}
