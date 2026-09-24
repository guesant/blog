<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class PageRevisionTranslation extends RevisionTranslation
{
    public const FIELDS = [
        'activitypub_description', 'activitypub_title', 'ai_body', 'ai_heading', 'api_description', 'api_title',
        'archive_label', 'assistindo', 'atom_description', 'atom_title', 'available_label', 'code_body',
        'code_heading', 'construindo', 'contact', 'contact_description', 'contact_eyebrow', 'contact_title',
        'content_body', 'content_heading', 'context', 'currently_exploring_label', 'description', 'estudando',
        'experience_description', 'experience_eyebrow', 'experience_title', 'experiments_summary',
        'experiments_title', 'eyebrow', 'future_label', 'future_title', 'hero_current_focus', 'hero_experience',
        'hero_identity', 'intro', 'introduction', 'jsonfeed_description', 'jsonfeed_title', 'lead', 'lendo', 'ouvindo',
        'planned_label', 'planned_title', 'projects_description', 'projects_eyebrow', 'projects_title',
        'recurring_technologies_label', 'robots_description', 'robots_title', 'rss_description', 'rss_title',
        'section_label', 'section_title', 'selected_label', 'sitemap_description', 'sitemap_title', 'story',
        'story_eyebrow', 'story_title', 'timeline_eyebrow', 'timeline_title', 'timeline_description', 'title', 'trabalhando', 'unavailable_label', 'webfinger_description',
        'webfinger_title', 'webmention_description', 'webmention_title', 'websub_description', 'websub_title',
        'work_description', 'work_eyebrow', 'work_title', 'writing_description', 'writing_eyebrow', 'writing_title',
    ];

    protected $table = 'page_revision_translations';

    public function revision(): BelongsTo
    {
        return $this->belongsTo(PageRevision::class, 'page_revision_id');
    }

    public function getFieldsAttribute(): array
    {
        $excluded = ['id', 'page_revision_id', 'locale', 'created_at', 'updated_at'];

        return collect($this->getAttributes())
            ->except($excluded)
            ->filter(static fn (mixed $value): bool => $value !== null)
            ->mapWithKeys(static fn (mixed $value, string $key): array => [Str::camel($key) => $value])
            ->all();
    }
}
