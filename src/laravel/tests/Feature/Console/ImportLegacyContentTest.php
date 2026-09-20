<?php

namespace Tests\Feature\Console;

use App\Models\Topic;
use App\Models\Writing;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class ImportLegacyContentTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (! File::exists('/migration-snapshot/writing.json')) {
            $this->markTestSkipped('migration-snapshot fixtures not available in this environment');
        }
    }

    public function test_dry_run_does_not_persist_any_changes(): void
    {
        $exitCode = Artisan::call('portfolio:import-legacy', ['--dry-run' => true]);

        $this->assertSame(0, $exitCode);
        $this->assertSame(0, Topic::count());
        $this->assertSame(0, Writing::count());
    }

    public function test_import_merges_tags_and_subject_categories_into_topics(): void
    {
        $exitCode = Artisan::call('portfolio:import-legacy');

        $this->assertSame(0, $exitCode);

        $tagTopic = Topic::where('slug', 'ai')->first();
        $this->assertNotNull($tagTopic);
        $this->assertSame('topic', $tagTopic->kind);
        $this->assertSame('AI', $tagTopic->translation('en')->name);
        $this->assertSame('IA', $tagTopic->translation('pt-BR')->name);

        $writing = Writing::where('slug', 'antes-de-programar')->first();
        $this->assertNotNull($writing);
        $this->assertTrue(
            $writing->topics->contains('slug', 'trajectory'),
            'expected writing to be attached to the topic merged from its legacy subject category'
        );
    }

    public function test_import_is_idempotent_and_does_not_duplicate_topics(): void
    {
        Artisan::call('portfolio:import-legacy');
        $firstRunCount = Topic::count();

        Artisan::call('portfolio:import-legacy');
        $secondRunCount = Topic::count();

        $this->assertSame($firstRunCount, $secondRunCount);
    }
}
