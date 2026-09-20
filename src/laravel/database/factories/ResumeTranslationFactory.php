<?php

namespace Database\Factories;

use App\Models\Resume;
use App\Models\ResumeTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResumeTranslationFactory extends Factory
{
    protected $model = ResumeTranslation::class;

    public function definition(): array
    {
        return [
            'resume_id' => Resume::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'summary' => $this->faker->optional()->paragraph(),
            'leadership' => null,
            'education' => null,
            'certificates' => null,
            'certifications' => null,
            'publications' => null,
            'recommendations' => null,
            'technical_productions' => null,
            'events' => null,
            'awards' => null,
        ];
    }
}
