<?php

namespace App\ReadModel\PublicSite\Content;

use App\Models\Language;
use App\Models\Resume;
use App\Models\ResumeLanguage;
use App\Models\ResumeSkill;
use App\Models\Technology;
use App\Models\Topic;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ResumeReader
{
    public function find(): ?Resume
    {
        $resume = Resume::query()
            ->whereHas('currentRevision', static function ($query): void {
                $query->where(fn ($visibility) => $visibility
                    ->where('hidden', false)
                    ->orWhereNull('hidden'));
            })
            ->with([
                'currentRevision' => static function ($query): void {
                    $query
                        ->where(fn ($visibility) => $visibility
                            ->where('hidden', false)
                            ->orWhereNull('hidden'))
                        ->with('translations');
                },
                'selectedCases.translations',
                'skills.topic',
                'skills.technologies',
                'languages.language',
            ])
            ->first();

        if ($resume?->currentRevision === null) {
            return $resume;
        }

        $revision = $resume->currentRevision;
        $resume->setRelation('selectedCases', $revision->selectedCases()
            ->where('hidden', false)
            ->where('nda', false)
            ->get());
        $resume->setRelation('skills', $this->skills($revision->id));
        $resume->setRelation('languages', $this->languages($revision->id));

        return $resume;
    }

    private function skills(int $revisionId): Collection
    {
        $rows = DB::table('resume_revision_skills')
            ->where('resume_revision_id', $revisionId)
            ->orderBy('sort_order')
            ->get();
        $topicIds = $rows->pluck('topic_id')->unique()->values();
        $topics = Topic::whereIn('id', $topicIds)
            ->where(fn ($visibility) => $visibility
                ->where('hidden', false)
                ->orWhereNull('hidden'))
            ->get()
            ->keyBy('id');
        $technologyRows = DB::table('resume_revision_skill_technologies')
            ->where('resume_revision_id', $revisionId)
            ->orderBy('sort_order')
            ->get();
        $technologies = Technology::whereIn('id', $technologyRows->pluck('technology_id')->unique())
            ->where(fn ($visibility) => $visibility
                ->where('hidden', false)
                ->orWhereNull('hidden'))
            ->get()
            ->keyBy('id');

        return $rows->map(function (object $row) use ($technologies, $technologyRows, $topics): ResumeSkill {
            $skill = new ResumeSkill(['topic_id' => $row->topic_id, 'order' => $row->sort_order]);
            $skill->setRelation('topic', $topics->get($row->topic_id));
            $skill->setRelation('technologies', $technologyRows
                ->where('topic_id', $row->topic_id)
                ->map(fn (object $technologyRow): ?Technology => $technologies->get($technologyRow->technology_id))
                ->filter()
                ->values());

            return $skill;
        });
    }

    private function languages(int $revisionId): Collection
    {
        $rows = DB::table('resume_revision_languages')
            ->where('resume_revision_id', $revisionId)
            ->orderBy('sort_order')
            ->get();
        $languages = Language::whereIn('id', $rows->pluck('language_id')->unique())
            ->get()
            ->keyBy('id');

        return $rows->map(function (object $row) use ($languages): ResumeLanguage {
            $language = new ResumeLanguage([
                'language_id' => $row->language_id,
                'proficiency' => $row->proficiency,
                'order' => $row->sort_order,
            ]);
            $language->setRelation('language', $languages->get($row->language_id));

            return $language;
        });
    }
}
