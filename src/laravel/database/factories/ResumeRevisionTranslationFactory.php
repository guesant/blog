<?php

namespace Database\Factories;

use App\Models\Resume;
use App\Models\ResumeRevision;
use App\Models\ResumeRevisionTranslation;

class ResumeRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = ResumeRevisionTranslation::class;

    protected string $identityClass = Resume::class;

    protected string $revisionClass = ResumeRevision::class;

    protected string $identityKey = 'resume_id';

    protected string $revisionKey = 'resume_revision_id';

    protected array $revisionColumns = ['hidden'];

    public function definition(): array
    {
        return [
            'resume_id' => Resume::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'summary' => $this->faker->optional()->paragraph(),
        ];
    }
}
