<?php

namespace Tests\Feature\Models;

use App\Models\CaseStudy;
use App\Models\CaseStudyTranslation;
use App\Models\Technology;
use Tests\TestCase;

class CaseStudyTest extends TestCase
{
    public function test_can_create_case_study(): void
    {
        $caseStudy = CaseStudy::factory()->create();

        $this->assertInstanceOf(CaseStudy::class, $caseStudy);
        $this->assertNotNull($caseStudy->id);
        $this->assertNotNull($caseStudy->slug);
    }

    public function test_case_study_has_translations_and_technologies(): void
    {
        $caseStudy = CaseStudy::factory()->create();
        CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id]);
        $technology = Technology::factory()->create();
        $caseStudy->technologies()->attach($technology);

        $this->assertCount(1, $caseStudy->translations);
        $this->assertCount(1, $caseStudy->technologies);
    }
}
