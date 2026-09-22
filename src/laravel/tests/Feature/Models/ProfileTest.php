<?php

namespace Tests\Feature\Models;

use App\Models\Profile;
use App\Models\ProfileRevisionTranslation;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    public function test_can_create_profile(): void
    {
        $profile = Profile::factory()->create();

        $this->assertInstanceOf(Profile::class, $profile);
        $this->assertNotNull($profile->id);
    }

    public function test_profile_has_translations(): void
    {
        $profile = Profile::factory()->create();
        ProfileRevisionTranslation::factory()->create(['profile_id' => $profile->id]);
        $profile->refresh();

        $this->assertCount(1, $profile->translations);
        $this->assertInstanceOf(ProfileRevisionTranslation::class, $profile->translations->first());
    }
}
