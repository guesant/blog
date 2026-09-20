<?php

namespace Database\Factories;

use App\Models\ContactProfile;
use App\Models\SiteSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactProfileFactory extends Factory
{
    protected $model = ContactProfile::class;

    public function definition(): array
    {
        return [
            'site_settings_id' => SiteSettings::factory(),
            'platform' => $this->faker->word(),
            'label' => $this->faker->optional()->word(),
            'url' => $this->faker->url(),
            'order' => $this->faker->optional()->numberBetween(1, 100),
        ];
    }
}
