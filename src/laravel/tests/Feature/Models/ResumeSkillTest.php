<?php

namespace Tests\Feature\Models;

use App\Models\ResumeSkill;
use App\Models\Topic;
use Tests\TestCase;

class ResumeSkillTest extends TestCase
{
    public function test_skill_topic_resolves_to_skill_kind_topic(): void
    {
        $skill = ResumeSkill::factory()->create();

        $this->assertInstanceOf(Topic::class, $skill->topic);
        $this->assertSame('skill', $skill->topic->kind);
    }
}
