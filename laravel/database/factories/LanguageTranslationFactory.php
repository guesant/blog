<?php

namespace Database\Factories;

use App\Models\Language;
use App\Models\LanguageTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class LanguageTranslationFactory extends Factory
{
    protected $model = LanguageTranslation::class;

    public function definition(): array
    {
        return [
            'language_id' => Language::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
        ];
    }
}
