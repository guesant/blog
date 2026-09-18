<?php

namespace Tests\Feature\Filament;

use App\Filament\Pages\ManageResume;
use App\Models\Resume;
use App\Models\ResumeSkill;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Livewire\Livewire;
use Tests\TestCase;

class ManageResumeTest extends TestCase
{
    private function actingAsAdmin(): User
    {
        Config::set('admin.allowed_emails', ['admin@example.com']);
        $user = User::factory()->create(['email' => 'admin@example.com']);
        $this->actingAs($user);

        return $user;
    }

    public function test_save_replaces_skills_with_the_submitted_topic_and_technologies(): void
    {
        $this->actingAsAdmin();

        $topic = Topic::factory()->create(['kind' => 'skill', 'slug' => 'save-test-skill']);
        $technology = Technology::factory()->create();

        Livewire::test(ManageResume::class)
            ->set('data.skills', [
                ['topic_id' => $topic->id, 'order' => 1, 'technologies' => [$technology->id]],
            ])
            ->call('save')
            ->assertHasNoErrors();

        $this->assertDatabaseHas('resume_skills', ['topic_id' => $topic->id, 'order' => 1]);

        $skill = ResumeSkill::where('topic_id', $topic->id)->firstOrFail();
        $this->assertTrue($skill->technologies->contains($technology->id));
    }

    public function test_save_deletes_previous_skills_before_recreating_them(): void
    {
        $this->actingAsAdmin();

        $staleTopic = Topic::factory()->create(['kind' => 'skill', 'slug' => 'stale-skill']);
        $newTopic = Topic::factory()->create(['kind' => 'skill', 'slug' => 'fresh-skill']);

        $resume = Resume::query()->first() ?? Resume::create();
        $resume->skills()->create(['topic_id' => $staleTopic->id, 'order' => 0]);

        Livewire::test(ManageResume::class)
            ->set('data.skills', [
                ['topic_id' => $newTopic->id, 'order' => 0, 'technologies' => []],
            ])
            ->call('save')
            ->assertHasNoErrors();

        $this->assertDatabaseMissing('resume_skills', ['topic_id' => $staleTopic->id]);
        $this->assertDatabaseHas('resume_skills', ['topic_id' => $newTopic->id]);
    }
}
