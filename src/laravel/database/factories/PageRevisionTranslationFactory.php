<?php

namespace Database\Factories;

use App\Models\Page;
use App\Models\PageRevision;
use App\Models\PageRevisionTranslation;

class PageRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = PageRevisionTranslation::class;

    protected string $identityClass = Page::class;

    protected string $revisionClass = PageRevision::class;

    protected string $identityKey = 'page_id';

    protected string $revisionKey = 'page_revision_id';

    protected array $revisionColumns = ['slug', 'hidden'];

    public function definition(): array
    {
        return [
            'page_id' => Page::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
        ];
    }
}
