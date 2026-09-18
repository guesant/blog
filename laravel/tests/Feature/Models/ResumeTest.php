<?php

namespace Tests\Feature\Models;

use App\Models\Resume;
use App\Models\ResumeTranslation;
use Tests\TestCase;

class ResumeTest extends TestCase
{
    public function test_can_create_resume(): void
    {
        $resume = Resume::factory()->create();

        $this->assertInstanceOf(Resume::class, $resume);
        $this->assertNotNull($resume->id);
    }

    public function test_resume_has_translations(): void
    {
        $resume = Resume::factory()->create();
        ResumeTranslation::factory()->create(['resume_id' => $resume->id]);

        $this->assertCount(1, $resume->translations);
        $this->assertInstanceOf(ResumeTranslation::class, $resume->translations->first());
    }
}
