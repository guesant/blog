<?php

namespace Tests\Feature\Models;

use App\Models\CaseStudy;
use App\Models\Page;
use App\Models\PageRevisionTranslation;
use Tests\TestCase;

class PageTest extends TestCase
{
    public function test_can_create_page(): void
    {
        $page = Page::factory()->create();

        $this->assertInstanceOf(Page::class, $page);
        $this->assertNotNull($page->id);
        $this->assertNotNull($page->slug);
    }

    public function test_page_has_translations_and_featured_cases(): void
    {
        $page = Page::factory()->create();
        PageRevisionTranslation::factory()->create(['page_id' => $page->id]);
        $page->refresh();
        $caseStudy = CaseStudy::factory()->create();
        $page->featuredCases()->attach($caseStudy);

        $this->assertCount(1, $page->translations);
        $this->assertCount(1, $page->featuredCases);
    }
}
