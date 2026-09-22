<?php

namespace Tests\Feature\Models;

use App\Models\SiteSettings;
use App\Models\SiteSettingsRevisionTranslation;
use Tests\TestCase;

class SiteSettingsTest extends TestCase
{
    public function test_can_create_site_settings(): void
    {
        $settings = SiteSettings::factory()->create();

        $this->assertInstanceOf(SiteSettings::class, $settings);
        $this->assertNotNull($settings->id);
    }

    public function test_site_settings_has_translations(): void
    {
        $settings = SiteSettings::factory()->create();
        SiteSettingsRevisionTranslation::factory()->create(['site_settings_id' => $settings->id]);
        $settings->refresh();

        $this->assertCount(1, $settings->translations);
        $this->assertInstanceOf(SiteSettingsRevisionTranslation::class, $settings->translations->first());
    }
}
