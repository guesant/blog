<?php

namespace Database\Factories;

use App\Models\Topic;
use App\Models\TopicRevision;
use App\Models\TopicRevisionTranslation;

class TopicRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = TopicRevisionTranslation::class;

    protected string $identityClass = Topic::class;

    protected string $revisionClass = TopicRevision::class;

    protected string $identityKey = 'topic_id';

    protected string $revisionKey = 'topic_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'order', 'kind', 'parent_id', 'hidden'];

    public function definition(): array
    {
        return [
            'topic_id' => Topic::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
        ];
    }
}
