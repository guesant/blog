<?php

namespace Database\Factories;

use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReferenceCollectionTranslationFactory extends Factory
{
    protected $model = ReferenceCollectionTranslation::class;

    public function definition(): array
    {
        return [
            'reference_collection_id' => ReferenceCollection::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->optional()->paragraph(),
            'intro' => $this->faker->optional()->paragraph(),
            'seo' => null,
        ];
    }
}
