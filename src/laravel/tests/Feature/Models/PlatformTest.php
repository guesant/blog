<?php

namespace Tests\Feature\Models;

use App\Models\ContactProfile;
use App\Models\Platform;
use Tests\TestCase;

class PlatformTest extends TestCase
{
    public function test_can_create_platform(): void
    {
        $platform = Platform::factory()->create();

        $this->assertNotNull($platform->id);
        $this->assertNotEmpty($platform->slug);
        $this->assertNotEmpty($platform->label);
    }

    public function test_platform_has_contact_profiles(): void
    {
        $platform = Platform::factory()->create();
        $contactProfile = ContactProfile::factory()->create(['platform_id' => $platform->id]);

        $this->assertTrue($platform->contactProfiles->contains($contactProfile));
    }
}
