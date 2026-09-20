<?php

namespace Tests\Feature\Models;

use App\Models\Language;
use App\Models\LanguageTranslation;
use Tests\TestCase;

class LanguageTest extends TestCase
{
    public function test_can_create_language(): void
    {
        $language = Language::factory()->create();

        $this->assertInstanceOf(Language::class, $language);
        $this->assertNotNull($language->id);
        $this->assertNotNull($language->slug);
    }

    public function test_language_has_translations(): void
    {
        $language = Language::factory()->create();
        LanguageTranslation::factory()->create(['language_id' => $language->id]);

        $this->assertCount(1, $language->translations);
        $this->assertInstanceOf(LanguageTranslation::class, $language->translations->first());
    }
}
