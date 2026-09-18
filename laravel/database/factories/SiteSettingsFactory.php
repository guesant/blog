<?php

namespace Database\Factories;

use App\Models\SiteSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiteSettingsFactory extends Factory
{
    protected $model = SiteSettings::class;

    public function definition(): array
    {
        return [
            'short_name' => $this->faker->optional()->word(),
            'portfolio_url' => $this->faker->optional()->url(),
            'maintenance_enabled' => $this->faker->boolean(),
            'contact_email' => $this->faker->optional()->safeEmail(),
            'contact_available' => $this->faker->boolean(),
        ];
    }
}
