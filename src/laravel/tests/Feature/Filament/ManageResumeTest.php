<?php

namespace Tests\Feature\Filament;

use App\Filament\Pages\ManageResume;
use App\Models\Resume;
use App\Models\ResumeRevisionTranslation;
use App\Models\ResumeSkill;
use App\Models\Technology;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Livewire\Livewire;
use Tests\TestCase;

class ManageResumeTest extends TestCase
{
    private function actingAsAdmin(): User
    {
        Config::set('services.keycloak.base_url', 'https://auth.test/realms/management');
        $user = User::factory()->create(['email' => 'admin@example.com']);
        $this->actingAs($user)->withSession([
            'admin_oidc_authorized' => true,
            'admin_oidc_expires_at' => now()->addHour()->timestamp,
            'admin_oidc_issuer' => 'https://auth.test/realms/management',
            'admin_oidc_subject' => 'admin-subject',
        ]);
        $user->update([
            'oidc_issuer' => 'https://auth.test/realms/management',
            'oidc_subject' => 'admin-subject',
        ]);

        return $user;
    }

    public function test_save_replaces_skills_with_the_submitted_topic_and_technologies(): void
    {
        $this->actingAsAdmin();

        $topic = Topic::factory()->create(['kind' => 'skill', 'slug' => 'save-test-skill']);
        $technology = Technology::factory()->create();

        Livewire::test(ManageResume::class)
            ->set('data.skills', [
                ['topic_id' => $topic->id, 'technologies' => [$technology->id]],
            ])
            ->call('save')
            ->assertHasNoErrors();

        $this->assertDatabaseHas('resume_skills', ['topic_id' => $topic->id, 'order' => 0]);

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

    public function test_mount_handles_existing_resume_revision_rows(): void
    {
        $this->actingAsAdmin();

        $translation = ResumeRevisionTranslation::factory()->create(['locale' => 'en']);

        DB::table('resume_revision_technical_productions')->insert([
            'resume_revision_translation_id' => $translation->id,
            'name' => 'Test production',
            'kind' => 'software',
            'period' => '2026',
            'include_in_pdf' => true,
            'hidden' => false,
            'sort_order' => 0,
        ]);

        Livewire::test(ManageResume::class)->assertHasNoErrors();
    }
}
