<?php

namespace Tests\Feature\Content;

use App\Content\CaseStudyQuery;
use App\Models\CaseStudy;
use App\Models\CaseStudyTranslation;
use Tests\TestCase;

class CaseStudyQueryTest extends TestCase
{
    public function test_list_returns_only_non_hidden(): void
    {
        $visible = CaseStudy::factory()->create(['hidden' => false, 'order' => 1]);
        CaseStudyTranslation::factory()->create(['case_study_id' => $visible->id, 'locale' => 'en']);

        $hidden = CaseStudy::factory()->create(['hidden' => true, 'order' => 2]);
        CaseStudyTranslation::factory()->create(['case_study_id' => $hidden->id, 'locale' => 'en']);

        $result = (new CaseStudyQuery)->list();

        $this->assertCount(1, $result);
        $this->assertEquals($visible->id, $result->first()->id);
    }

    public function test_find_by_slug_returns_case_study(): void
    {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'test-case', 'hidden' => false]);
        CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);

        $result = (new CaseStudyQuery)->findBySlug('test-case');

        $this->assertNotNull($result);
        $this->assertEquals('test-case', $result->slug);
    }

    public function test_find_by_slug_returns_null_for_hidden(): void
    {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'hidden-case', 'hidden' => true]);
        CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);

        $result = (new CaseStudyQuery)->findBySlug('hidden-case');

        $this->assertNull($result);
    }
}
