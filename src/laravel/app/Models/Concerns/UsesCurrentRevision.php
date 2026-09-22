<?php

namespace App\Models\Concerns;

use App\Content\Locale;
use App\Models\CaseStudyRevision;
use App\Models\CaseStudyRevisionTranslation;
use App\Models\CreditEntryRevision;
use App\Models\CreditEntryRevisionTranslation;
use App\Models\ExperimentRevision;
use App\Models\ExperimentRevisionTranslation;
use App\Models\LanguageRevision;
use App\Models\LanguageRevisionTranslation;
use App\Models\NavItemRevision;
use App\Models\NavItemRevisionTranslation;
use App\Models\PageRevision;
use App\Models\PageRevisionTranslation;
use App\Models\ProfileRevision;
use App\Models\ProfileRevisionTranslation;
use App\Models\ProjectRevision;
use App\Models\ProjectRevisionTranslation;
use App\Models\ReferenceCollectionRevision;
use App\Models\ReferenceCollectionRevisionTranslation;
use App\Models\ResourceRevision;
use App\Models\ResourceRevisionTranslation;
use App\Models\ResumeRevision;
use App\Models\ResumeRevisionTranslation;
use App\Models\SiteSettingsRevision;
use App\Models\SiteSettingsRevisionTranslation;
use App\Models\SnippetRevision;
use App\Models\SnippetRevisionTranslation;
use App\Models\TechnologyRevision;
use App\Models\TechnologyRevisionTranslation;
use App\Models\TopicRevision;
use App\Models\TopicRevisionTranslation;
use App\Models\WritingRevision;
use App\Models\WritingRevisionTranslation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

trait UsesCurrentRevision
{
    private const TRANSLATION_DEFINITIONS = [
        'case_studies' => [CaseStudyRevisionTranslation::class, 'case_study_revision_id'],
        'credit_entries' => [CreditEntryRevisionTranslation::class, 'credit_entry_revision_id'],
        'experiments' => [ExperimentRevisionTranslation::class, 'experiment_revision_id'],
        'languages' => [LanguageRevisionTranslation::class, 'language_revision_id'],
        'nav_items' => [NavItemRevisionTranslation::class, 'nav_item_revision_id'],
        'pages' => [PageRevisionTranslation::class, 'page_revision_id'],
        'profiles' => [ProfileRevisionTranslation::class, 'profile_revision_id'],
        'projects' => [ProjectRevisionTranslation::class, 'project_revision_id'],
        'reference_collections' => [ReferenceCollectionRevisionTranslation::class, 'reference_collection_revision_id'],
        'resources' => [ResourceRevisionTranslation::class, 'resource_revision_id'],
        'resumes' => [ResumeRevisionTranslation::class, 'resume_revision_id'],
        'site_settings' => [SiteSettingsRevisionTranslation::class, 'site_settings_revision_id'],
        'snippets' => [SnippetRevisionTranslation::class, 'snippet_revision_id'],
        'technologies' => [TechnologyRevisionTranslation::class, 'technology_revision_id'],
        'topics' => [TopicRevisionTranslation::class, 'topic_revision_id'],
        'writings' => [WritingRevisionTranslation::class, 'writing_revision_id'],
    ];

    public function currentRevision(): BelongsTo
    {
        $model = [
            'case_studies' => CaseStudyRevision::class,
            'experiments' => ExperimentRevision::class,
            'pages' => PageRevision::class,
            'profiles' => ProfileRevision::class,
            'projects' => ProjectRevision::class,
            'reference_collections' => ReferenceCollectionRevision::class,
            'resources' => ResourceRevision::class,
            'resumes' => ResumeRevision::class,
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

    public function translations(): HasMany
    {
        [$model, $foreignKey] = self::TRANSLATION_DEFINITIONS[$this->getTable()];

        return $this->hasMany($model, $foreignKey, 'current_revision_id');
    }

    public function translation(?string $locale = null): ?Model
    {
        $normalized = Locale::normalize($locale);

        return $this->translations->firstWhere('locale', $normalized)
            ?? $this->translations->firstWhere('locale', 'en');
    }
}
