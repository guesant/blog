<?php

namespace Database\Factories;

use App\Content\EditorialRevisionPublisher;
use App\Models\SiteSettings;
use Illuminate\Database\Eloquent\Factories\Factory;

class SiteSettingsFactory extends Factory
{
    protected $model = SiteSettings::class;

    public function configure(): static
    {
        return $this->afterCreating(function (SiteSettings $settings): void {
            app(EditorialRevisionPublisher::class)->publish($settings, []);
        });
    }

    public function definition(): array
    {
        return [
            'short_name' => $this->faker->optional()->word(),
            'portfolio_url' => $this->faker->optional()->url(),
            'maintenance_enabled' => $this->faker->boolean(),
            'contact_email' => $this->faker->optional()->safeEmail(),
            'contact_enabled' => true,
            'contact_available' => $this->faker->boolean(),
            'content_actions_copy_text' => false,
            'content_actions_copy_url' => false,
            'content_actions_download_text' => false,
            'contextual_cursor_enabled' => false,
        ];
    }
}
