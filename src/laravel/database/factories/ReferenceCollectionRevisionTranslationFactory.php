<?php

namespace Database\Factories;

use App\Models\ReferenceCollection;
use App\Models\ReferenceCollectionRevision;
use App\Models\ReferenceCollectionRevisionTranslation;

class ReferenceCollectionRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = ReferenceCollectionRevisionTranslation::class;

    protected string $identityClass = ReferenceCollection::class;

    protected string $revisionClass = ReferenceCollectionRevision::class;

    protected string $identityKey = 'reference_collection_id';

    protected string $revisionKey = 'reference_collection_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'order', 'image', 'published_at'];

    public function definition(): array
    {
        return [
            'reference_collection_id' => ReferenceCollection::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->optional()->paragraph(),
            'intro' => $this->faker->optional()->paragraph(),
        ];
    }
}
