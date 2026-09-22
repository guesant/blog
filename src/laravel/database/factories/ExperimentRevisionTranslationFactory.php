<?php

namespace Database\Factories;

use App\Models\Experiment;
use App\Models\ExperimentRevision;
use App\Models\ExperimentRevisionTranslation;

class ExperimentRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = ExperimentRevisionTranslation::class;

    protected string $identityClass = Experiment::class;

    protected string $revisionClass = ExperimentRevision::class;

    protected string $identityKey = 'experiment_id';

    protected string $revisionKey = 'experiment_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'published_at', 'show_history'];

    public function definition(): array
    {
        return [
            'experiment_id' => Experiment::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
            'purpose' => $this->faker->paragraph(),
            'body' => $this->faker->optional()->paragraph(),
        ];
    }
}
