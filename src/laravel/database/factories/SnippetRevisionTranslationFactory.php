<?php

namespace Database\Factories;

use App\Models\Snippet;
use App\Models\SnippetRevision;
use App\Models\SnippetRevisionTranslation;

class SnippetRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = SnippetRevisionTranslation::class;

    protected string $identityClass = Snippet::class;

    protected string $revisionClass = SnippetRevision::class;

    protected string $identityKey = 'snippet_id';

    protected string $revisionKey = 'snippet_revision_id';

    protected array $revisionColumns = ['slug', 'public_id', 'hidden', 'show_history', 'order', 'published_at'];

    public function definition(): array
    {
        return [
            'snippet_id' => Snippet::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->sentence(),
            'description' => $this->faker->optional()->paragraph(),
        ];
    }
}
