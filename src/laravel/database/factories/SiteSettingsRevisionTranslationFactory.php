<?php

namespace Database\Factories;

use App\Models\SiteSettings;
use App\Models\SiteSettingsRevision;
use App\Models\SiteSettingsRevisionTranslation;

class SiteSettingsRevisionTranslationFactory extends RevisionTranslationFactory
{
    protected $model = SiteSettingsRevisionTranslation::class;

    protected string $identityClass = SiteSettings::class;

    protected string $revisionClass = SiteSettingsRevision::class;

    protected string $identityKey = 'site_settings_id';

    protected string $revisionKey = 'site_settings_revision_id';

    protected array $revisionColumns = ['short_name', 'portfolio_url', 'maintenance_enabled', 'contact_email', 'contact_enabled', 'contact_available', 'source_repository_url', 'content_actions_copy_text', 'content_actions_copy_url', 'content_actions_download_text', 'contextual_cursor_enabled'];

    public function definition(): array
    {
        return [
            'site_settings_id' => SiteSettings::factory(),
            'locale' => $this->faker->randomElement(['en', 'pt-BR']),
            'copyright_template' => $this->faker->optional()->sentence(),
            'maintenance_title' => $this->faker->optional()->word(),
            'maintenance_description' => $this->faker->optional()->paragraph(),
        ];
    }
}
