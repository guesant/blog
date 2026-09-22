<?php

namespace Database\Factories;

use App\Models\CaseStudy;
use App\Models\CaseStudyRevision;
use App\Models\CaseStudyRevisionTranslation;

class CaseStudyRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = CaseStudyRevisionTranslation::class;

    protected string $identityClass = CaseStudy::class;

    protected string $revisionClass = CaseStudyRevision::class;

    protected string $identityKey = 'case_study_id';

    protected string $revisionKey = 'case_study_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'visual', 'nda', 'published_at', 'show_history'];

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
