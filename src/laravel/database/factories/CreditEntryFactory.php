<?php

namespace Database\Factories;

use App\Models\CreditEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

class CreditEntryFactory extends Factory
{
    protected $model = CreditEntry::class;

    public function definition(): array
    {
        return [
            'url' => $this->faker->optional()->url(),
            'category' => $this->faker->randomElement(['reference', 'infrastructure']),
            'order' => $this->faker->numberBetween(1, 100),
        ];
    }
}
