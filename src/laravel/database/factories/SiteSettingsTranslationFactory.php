<?php

namespace Database\Factories;

use App\Models\SiteSettings;
use App\Models\SiteSettingsTranslation;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiteSettingsTranslationFactory extends Factory
{
    protected $model = SiteSettingsTranslation::class;

    public function definition(): array
    {
        return [
            'site_settings_id' => SiteSettings::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'copyright_template' => $this->faker->optional()->sentence(),
            'maintenance_eyebrow' => $this->faker->optional()->word(),
            'maintenance_title' => $this->faker->optional()->word(),
            'maintenance_description' => $this->faker->optional()->paragraph(),
        ];
    }
}
