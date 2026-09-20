<?php

namespace Database\Factories;

use App\Models\Language;
use App\Models\Resume;
use App\Models\ResumeLanguage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResumeLanguageFactory extends Factory
{
    protected $model = ResumeLanguage::class;

    public function definition(): array
    {
        return [
            'resume_id' => Resume::factory(),
            'language_id' => Language::factory(),
            'proficiency' => $this->faker->optional()->word(),
            'order' => $this->faker->optional()->numberBetween(1, 100),
        ];
    }
}
