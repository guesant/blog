<?php

namespace Database\Factories;

use App\Models\ContactProfile;
use App\Models\Platform;
use App\Models\SiteSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactProfileFactory extends Factory
{
    protected $model = ContactProfile::class;

    public function definition(): array
    {
        return [
            'site_settings_id' => SiteSettings::factory(),
            'platform_id' => Platform::factory(),
            'url' => $this->faker->url(),
            'order' => $this->faker->optional()->numberBetween(1, 100),
        ];
    }
}
