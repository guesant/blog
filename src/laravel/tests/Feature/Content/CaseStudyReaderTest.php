<?php

namespace Tests\Feature\Content;

use App\Models\CaseStudy;
use App\Models\CaseStudyRevisionTranslation;
use App\ReadModel\PublicSite\Content\CaseStudyReader;
use Tests\TestCase;

class CaseStudyReaderTest extends TestCase
{
    public function test_list_returns_only_non_hidden(): void
    {
        $visible = CaseStudy::factory()->create(['hidden' => false, 'order' => 1]);
        CaseStudyRevisionTranslation::factory()->create(['case_study_id' => $visible->id, 'locale' => 'en']);

        $hidden = CaseStudy::factory()->create(['hidden' => true, 'order' => 2]);
        CaseStudyRevisionTranslation::factory()->create(['case_study_id' => $hidden->id, 'locale' => 'en']);

        $result = (new CaseStudyReader)->listPaginated()->getCollection();

        $this->assertCount(1, $result);
        $this->assertEquals($visible->id, $result->first()->id);
    }

    public function test_find_by_slug_returns_case_study(): void
    {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'test-case', 'hidden' => false]);
        CaseStudyRevisionTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);

        $result = (new CaseStudyReader)->findBySlug('test-case');

        $this->assertNotNull($result);
        $this->assertEquals('test-case', $result->slug);
    }

    public function test_find_by_slug_returns_null_for_hidden(): void
    {
        $caseStudy = CaseStudy::factory()->create(['slug' => 'hidden-case', 'hidden' => true]);
        CaseStudyRevisionTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);

        $result = (new CaseStudyReader)->findBySlug('hidden-case');

        $this->assertNull($result);
    }
}
