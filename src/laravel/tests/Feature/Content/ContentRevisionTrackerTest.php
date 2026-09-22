<?php

namespace Tests\Feature\Content;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ContentRevisionTrackerTest extends TestCase
{
    public function test_content_revisions_are_entity_scoped(): void
    {
        $this->assertTrue(DB::getSchemaBuilder()->hasTable('project_revisions'));
        $this->assertTrue(DB::getSchemaBuilder()->hasColumn('projects', 'current_revision_id'));
        $this->assertTrue(DB::getSchemaBuilder()->hasColumn('projects', 'published_revision_id'));
        $this->assertFalse(DB::getSchemaBuilder()->hasTable('content_revisions'));
    }
}
