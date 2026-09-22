<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\ProfileRevision;
use App\Models\ProfileRevisionTranslation;

class ProfileRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = ProfileRevisionTranslation::class;

    protected string $identityClass = Profile::class;

    protected string $revisionClass = ProfileRevision::class;

    protected string $identityKey = 'profile_id';

    protected string $revisionKey = 'profile_revision_id';

    protected array $revisionColumns = ['name', 'birth_date', 'hidden'];

    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'title' => $this->faker->optional()->word(),
            'location' => $this->faker->optional()->city(),
            'birth_city' => $this->faker->optional()->city(),
            'description' => $this->faker->optional()->paragraph(),
            'interests' => $this->faker->optional()->paragraph(),
            'learning' => $this->faker->optional()->paragraph(),
        ];
    }
}
