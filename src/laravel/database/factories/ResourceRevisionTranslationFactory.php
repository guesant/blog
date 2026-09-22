<?php

namespace Database\Factories;

use App\Models\Resource;
use App\Models\ResourceRevision;
use App\Models\ResourceRevisionTranslation;

class ResourceRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = ResourceRevisionTranslation::class;

    protected string $identityClass = Resource::class;

    protected string $revisionClass = ResourceRevision::class;

    protected string $identityKey = 'resource_id';

    protected string $revisionKey = 'resource_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'order', 'type', 'language_id', 'published_date_iso', 'found_date_iso', 'consumption_state', 'rating', 'editorial_state', 'visibility', 'featured', 'featured_order', 'popularity_kind', 'popularity_rank', 'popularity_value'];

    public function definition(): array
    {
        return [
            'resource_id' => Resource::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'alternative_title' => $this->faker->optional()->sentence(),
            'description' => $this->faker->optional()->paragraph(),
            'personal_note' => $this->faker->optional()->paragraph(),
            'reason_found' => $this->faker->optional()->paragraph(),
        ];
    }
}
