<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\PageTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageTranslationFactory extends Factory
{
    protected $model = PageTranslation::class;

    public function definition(): array
    {
        return [
            'page_id' => Page::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'fields' => [],
        ];
    }
}
