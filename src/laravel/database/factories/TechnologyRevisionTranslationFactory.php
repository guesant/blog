<?php

namespace Database\Factories;

use App\Models\Technology;
use App\Models\TechnologyRevision;
use App\Models\TechnologyRevisionTranslation;

class TechnologyRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = TechnologyRevisionTranslation::class;

    protected string $identityClass = Technology::class;

    protected string $revisionClass = TechnologyRevision::class;

    protected string $identityKey = 'technology_id';

    protected string $revisionKey = 'technology_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'order', 'code', 'logo', 'hidden'];

    public function definition(): array
    {
        return [
            'technology_id' => Technology::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
        ];
    }
}
