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
use Illuminate\Database\Eloquent\Builder;
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

    private const REVISION_DEFINITIONS = [
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
    ];

    private const HIDDEN_REVISION_TABLES = [
        'case_study_revisions',
        'experiment_revisions',
        'nav_item_revisions',
        'page_revisions',
        'profile_revisions',
        'project_revisions',
        'reference_collection_revisions',
        'resource_revisions',
        'resume_revisions',
        'snippet_revisions',
        'technology_revisions',
        'topic_revisions',
        'writing_revisions',
    ];

    private const HIDDEN_BASE_TABLES = [
        'case_studies',
        'experiments',
        'pages',
        'profiles',
        'projects',
        'reference_collections',
        'resources',
        'resumes',
        'snippets',
        'technologies',
        'topics',
        'writings',
    ];

    public function currentRevision(): BelongsTo
    {
        $model = self::REVISION_DEFINITIONS[$this->getTable()] ?? Model::class;

        return $this->belongsTo($model, 'current_revision_id');
    }

    public function publishedRevision(): BelongsTo
    {
        $model = self::REVISION_DEFINITIONS[$this->getTable()] ?? Model::class;

        return $this->belongsTo($model, 'published_revision_id');
    }

    public function publishedTranslations(): HasMany
    {
        [$model, $foreignKey] = self::TRANSLATION_DEFINITIONS[$this->getTable()] ?? [Model::class, 'published_revision_id'];

        return $this->hasMany($model, $foreignKey, 'published_revision_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        if (! array_key_exists($this->getTable(), self::REVISION_DEFINITIONS)) {
            return $query;
        }

        $revisionModel = self::REVISION_DEFINITIONS[$this->getTable()];
        $revisionTable = (new $revisionModel)->getTable();

        return $query
            ->whereNotNull($query->getModel()->qualifyColumn('published_revision_id'))
            ->when(
                in_array($this->getTable(), self::HIDDEN_BASE_TABLES, true),
                static fn (Builder $visible): Builder => $visible->where(fn (Builder $visibility): Builder => $visibility
                    ->where($visible->getModel()->qualifyColumn('hidden'), false)
                    ->orWhereNull($visible->getModel()->qualifyColumn('hidden'))),
            )
            ->whereHas('publishedRevision', function (Builder $revisionQuery) use ($revisionTable): void {
                if (in_array($revisionTable, self::HIDDEN_REVISION_TABLES, true)) {
                    $revisionQuery->where(fn (Builder $visibility): Builder => $visibility
                        ->where('hidden', false)
                        ->orWhereNull('hidden'));
                }
            });
    }

    public function translations(): HasMany
    {
        [$model, $foreignKey] = self::TRANSLATION_DEFINITIONS[$this->getTable()];

        return $this->hasMany($model, $foreignKey, 'current_revision_id');
    }

    public function translation(?string $locale = null): ?Model
    {
        $normalized = Locale::normalize($locale);
        $translations = $this->relationLoaded('publishedTranslations')
            ? $this->publishedTranslations
            : $this->translations;

        return $translations->firstWhere('locale', $normalized)
            ?? $translations->firstWhere('locale', 'en');
    }
}
