<?php

namespace Tests\Feature\Content;

use App\Models\Project;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ContentRevisionTrackerTest extends TestCase
{
    public function test_content_writes_bump_the_revision(): void
    {
        $this->assertNull(DB::table('content_revisions')->value('version'));

        $project = Project::factory()->create();

        $this->assertSame(1, DB::table('content_revisions')->value('version'));

        $project->update(['hidden' => ! $project->hidden]);

        $this->assertSame(2, DB::table('content_revisions')->value('version'));

        $project->delete();

        $this->assertSame(3, DB::table('content_revisions')->value('version'));
    }
}
