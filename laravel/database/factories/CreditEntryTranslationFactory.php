<?php

namespace Database\Factories;

use App\Models\CreditEntry;
use App\Models\CreditEntryTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreditEntryTranslationFactory extends Factory
{
    protected $model = CreditEntryTranslation::class;

    public function definition(): array
    {
        return [
            'credit_entry_id' => CreditEntry::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
            'description' => $this->faker->optional()->paragraph(),
        ];
    }
}
