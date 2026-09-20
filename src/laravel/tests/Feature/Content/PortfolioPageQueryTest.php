<?php

namespace Tests\Feature\Content;

use App\Content\PortfolioPageQuery;
use App\Models\CaseStudy;
use App\Models\CaseStudyTranslation;
use App\Models\Page;
use App\Models\PageTranslation;
use App\Models\Profile;
use App\Models\ProfileTranslation;
use App\Models\Project;
use App\Models\ProjectTranslation;
use App\Models\SiteSettings;
use App\Models\SiteSettingsTranslation;
use Tests\TestCase;

class PortfolioPageQueryTest extends TestCase
{
    public function test_portfolio_page_query_returns_structured_data(): void
    {
        $page = Page::factory()->create(['slug' => 'portfolio']);
        PageTranslation::factory()->create(['page_id' => $page->id, 'locale' => 'en']);

        $caseStudy = CaseStudy::factory()->create(['hidden' => false]);
        CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);

        $project = Project::factory()->create(['hidden' => false]);
        ProjectTranslation::factory()->create(['project_id' => $project->id, 'locale' => 'en']);

        $page->featuredCases()->attach($caseStudy, ['order' => 1]);
        $page->featuredProjects()->attach($project, ['order' => 1]);

        $profile = Profile::factory()->create();
        ProfileTranslation::factory()->create(['profile_id' => $profile->id, 'locale' => 'en']);

        $site = SiteSettings::factory()->create();
        SiteSettingsTranslation::factory()->create(['site_settings_id' => $site->id, 'locale' => 'en']);

        $result = (new PortfolioPageQuery)->build();

        $this->assertIsArray($result);
        $this->assertArrayHasKey('page', $result);
        $this->assertArrayHasKey('cases', $result);
        $this->assertArrayHasKey('projects', $result);
        $this->assertArrayHasKey('experiments', $result);
        $this->assertArrayHasKey('profile', $result);
        $this->assertArrayHasKey('site', $result);
        $this->assertArrayNotHasKey('writings', $result);
        $this->assertArrayNotHasKey('recurringTechnologies', $result);

        $this->assertEquals($page->id, $result['page']->id);
        $this->assertCount(1, $result['cases']);
        $this->assertCount(1, $result['projects']);
    }

    public function test_portfolio_page_query_limits_featured_cases_and_projects_to_three(): void
    {
        $page = Page::factory()->create(['slug' => 'portfolio']);
        PageTranslation::factory()->create(['page_id' => $page->id, 'locale' => 'en']);

        foreach (range(1, 4) as $order) {
            $caseStudy = CaseStudy::factory()->create(['hidden' => false]);
            CaseStudyTranslation::factory()->create(['case_study_id' => $caseStudy->id, 'locale' => 'en']);
            $page->featuredCases()->attach($caseStudy, ['order' => $order]);

            $project = Project::factory()->create(['hidden' => false]);
            ProjectTranslation::factory()->create(['project_id' => $project->id, 'locale' => 'en']);
            $page->featuredProjects()->attach($project, ['order' => $order]);
        }

        $result = (new PortfolioPageQuery)->build();

        $this->assertCount(3, $result['cases']);
        $this->assertCount(3, $result['projects']);
    }
}
