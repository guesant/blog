<?php

namespace Database\Factories;

use App\Models\Writing;
use App\Models\WritingRevision;
use App\Models\WritingRevisionTranslation;

class WritingRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = WritingRevisionTranslation::class;

    protected string $identityClass = Writing::class;

    protected string $revisionClass = WritingRevision::class;

    protected string $identityKey = 'writing_id';

    protected string $revisionKey = 'writing_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'date_iso', 'type', 'show_history'];

    public function definition(): array
    {
        return [
            'writing_id' => Writing::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'excerpt' => $this->faker->optional()->paragraph(),
            'reading_time' => $this->faker->optional()->word(),
            'body' => $this->faker->optional()->paragraph(),
        ];
    }
}
