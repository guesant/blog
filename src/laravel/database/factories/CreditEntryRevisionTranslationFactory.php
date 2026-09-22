<?php

namespace Database\Factories;

use App\Models\CreditEntry;
use App\Models\CreditEntryRevision;
use App\Models\CreditEntryRevisionTranslation;

class CreditEntryRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = CreditEntryRevisionTranslation::class;

    protected string $identityClass = CreditEntry::class;

    protected string $revisionClass = CreditEntryRevision::class;

    protected string $identityKey = 'credit_entry_id';

    protected string $revisionKey = 'credit_entry_revision_id';

    protected array $revisionColumns = ['url', 'category', 'order', 'is_automatic', 'active', 'package_manager', 'package_name'];

    public function definition(): array
    {
        return [
            'credit_entry_id' => CreditEntry::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'name' => $this->faker->word(),
            'description' => $this->faker->optional()->paragraph(),
        ];
    }
}
