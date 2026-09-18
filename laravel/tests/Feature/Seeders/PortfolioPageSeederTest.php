<?php

namespace Tests\Feature\Seeders;

use App\Models\CaseStudy;
use App\Models\CaseStudyTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Project;
use App\Models\ProjectTranslation;
use Database\Seeders\PortfolioPageSeeder;
use Tests\TestCase;

class PortfolioPageSeederTest extends TestCase
{
    public function test_seeder_is_idempotent(): void
    {
        $this->createVisibleCasesAndProjects();

        (new PortfolioPageSeeder)->run();
        (new PortfolioPageSeeder)->run();

        $page = Page::where('slug', 'portfolio')->firstOrFail();

        $this->assertCount(2, $page->translations);
        $this->assertCount(3, $page->featuredCases);
        $this->assertCount(3, $page->featuredProjects);
    }

    public function test_seeder_does_not_overwrite_existing_field_values(): void
    {
        $page = Page::factory()->create(['slug' => 'portfolio']);
        PageTranslation::factory()->create([
            'page_id' => $page->id,
            'locale' => 'en',
            'fields' => ['heroIdentity' => 'a very specific existing value'],
        ]);

        (new PortfolioPageSeeder)->run();

        $translation = $page->translations()->where('locale', 'en')->firstOrFail();

        $this->assertSame('a very specific existing value', $translation->fields['heroIdentity']);
        $this->assertArrayHasKey('workTitle', $translation->fields);
    }

    public function test_seeder_leaves_existing_featured_pivots_untouched(): void
    {
        $page = Page::factory()->create(['slug' => 'portfolio']);

        $caseStudy = CaseStudy::factory()->create(['hidden' => false, 'nda' => false]);
        CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);
        $page->featuredCases()->attach($caseStudy, ['order' => 1]);

        $this->createVisibleCasesAndProjects();

        (new PortfolioPageSeeder)->run();

        $page->refresh();

        $this->assertCount(1, $page->featuredCases);
        $this->assertSame($caseStudy->id, $page->featuredCases->first()->id);
    }

    private function createVisibleCasesAndProjects(): void
    {
        foreach (range(1, 4) as $order) {
            $caseStudy = CaseStudy::factory()->create(['hidden' => false, 'nda' => false, 'order' => $order]);
            CaseStudyTranslation::factory()->create([
                'case_study_id' => $caseStudy->id,
                'locale' => 'en',
                'title' => "Case {$this->ordinalWord($order)}",
            ]);
            CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'pt-BR']);

            $project = Project::factory()->create(['hidden' => false, 'nda' => false, 'order' => $order]);
            ProjectTranslation::factory()->create(['project_id' => $project->id, 'locale' => 'en']);
            ProjectTranslation::factory()->create(['project_id' => $project->id, 'locale' => 'pt-BR']);
        }
    }

    private function ordinalWord(int $order): string
    {
        return match ($order) {
            1 => 'One',
            2 => 'Two',
            3 => 'Three',
            default => 'Four',
        };
    }
}
