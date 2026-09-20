<?php

namespace Database\Factories;

use App\Models\Resume;
use App\Models\ResumeSkill;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResumeSkillFactory extends Factory
{
    protected $model = ResumeSkill::class;

    public function definition(): array
    {
        return [
            'resume_id' => Resume::factory(),
            'topic_id' => Topic::factory()->state(['kind' => 'skill']),
            'order' => $this->faker->optional()->numberBetween(1, 100),
        ];
    }
}
