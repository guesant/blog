<?php

namespace Database\Factories;

use App\Models\Language;
use App\Models\LanguageRevision;
use App\Models\LanguageRevisionTranslation;

class LanguageRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = LanguageRevisionTranslation::class;

    protected string $identityClass = Language::class;

    protected string $revisionClass = LanguageRevision::class;

    protected string $identityKey = 'language_id';

    protected string $revisionKey = 'language_revision_id';

    protected array $revisionColumns = ['slug', 'order', 'code'];

    public function definition(): array
    {
        return [
            'language_id' => Language::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
        ];
    }
}
