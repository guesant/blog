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
            ->published()
            ->with('publishedTranslations')
            ->first();

        if ($resume?->publishedRevision === null) {
            return $resume;
        }

        $revision = $resume->publishedRevision;
        $resume->setRelation('selectedCases', $revision->selectedCases()
            ->published()
            ->whereHas('publishedRevision', static fn ($query) => $query->where('nda', false))
            ->with([
                'publishedTranslations',
                'technologies' => static fn ($query) => $query->published(),
                'technologies.publishedTranslations',
            ])
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
        $topics = Topic::query()
            ->published()
            ->whereIn('id', $topicIds)
            ->with('publishedTranslations')
            ->get()
            ->keyBy('id');
        $technologyRows = DB::table('resume_revision_skill_technologies')
            ->where('resume_revision_id', $revisionId)
            ->orderBy('sort_order')
            ->get();
        $technologies = Technology::query()
            ->published()
            ->whereIn('id', $technologyRows->pluck('technology_id')->unique())
            ->with('publishedTranslations')
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
        $languages = Language::query()
            ->published()
            ->whereIn('id', $rows->pluck('language_id')->unique())
            ->with('publishedTranslations')
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
