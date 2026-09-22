<?php

namespace Tests\Feature\Models;

use App\Models\Resume;
use App\Models\ResumeRevisionTranslation;
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
        ResumeRevisionTranslation::factory()->create(['resume_id' => $resume->id]);
        $resume->refresh();

        $this->assertCount(1, $resume->translations);
        $this->assertInstanceOf(ResumeRevisionTranslation::class, $resume->translations->first());
    }
}
