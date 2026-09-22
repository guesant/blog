<?php

namespace Database\Factories;

use App\Models\CaseStudy;
use App\Models\CaseStudyTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class CaseStudyTranslationFactory extends Factory
{
    protected $model = CaseStudyTranslation::class;

    public function definition(): array
    {
        return [
            'case_study_id' => CaseStudy::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'status' => $this->faker->optional()->word(),
            'meta' => $this->faker->optional()->word(),
            'summary' => $this->faker->optional()->paragraph(),
            'context' => $this->faker->optional()->paragraph(),
            'role' => $this->faker->optional()->word(),
            'result' => $this->faker->optional()->paragraph(),
            'body' => $this->faker->optional()->paragraph(),
        ];
    }
}
