<?php

namespace App\Models\Concerns;

use App\Content\RevisionTranslationFactory;
use App\Models\CaseStudyRevision;
use App\Models\CreditEntryRevision;
use App\Models\ExperimentRevision;
use App\Models\LanguageRevision;
use App\Models\NavItemRevision;
use App\Models\ProjectRevision;
use App\Models\ReferenceCollectionRevision;
use App\Models\SiteSettingsRevision;
use App\Models\SnippetRevision;
use App\Models\TechnologyRevision;
use App\Models\TopicRevision;
use App\Models\WritingRevision;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait UsesCurrentRevision
{
    public function currentRevision(): BelongsTo
    {
        $model = [
            'case_studies' => CaseStudyRevision::class,
            'experiments' => ExperimentRevision::class,
            'projects' => ProjectRevision::class,
            'reference_collections' => ReferenceCollectionRevision::class,
            'writings' => WritingRevision::class,
            'site_settings' => SiteSettingsRevision::class,
            'nav_items' => NavItemRevision::class,
            'credit_entries' => CreditEntryRevision::class,
            'snippets' => SnippetRevision::class,
            'technologies' => TechnologyRevision::class,
            'topics' => TopicRevision::class,
            'languages' => LanguageRevision::class,
        ][$this->getTable()] ?? Model::class;

        return $this->belongsTo($model, 'current_revision_id');
    }

    public function translation(?string $locale = null): mixed
    {
        return app(RevisionTranslationFactory::class)->for($this, $locale)
            ?? $this->legacyTranslation($locale);
    }
}
