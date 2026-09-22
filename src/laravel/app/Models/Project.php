<?php

namespace App\Models;

use App\Content\Graph\GraphNode;
use App\Content\Graph\InteractsWithGraph;
use App\Content\Locale;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property bool $show_history
 *
 * @method ProjectTranslation|null translation(?string $locale = null)
 */
class Project extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, HasTranslations, InteractsWithGraph, UsesCurrentRevision {
        UsesCurrentRevision::translation insteadof HasTranslations;
        HasTranslations::translation as legacyTranslation;
    }

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'nda', 'published_at', 'show_history'];

    protected $casts = ['hidden' => 'boolean', 'external' => 'boolean', 'nda' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'];

    /**
     * @return HasMany<ProjectTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ProjectTranslation::class);
    }

    /**
     * @return BelongsToMany<Technology, $this>
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'project_technology')->withPivot('order')->orderByPivot('order');
    }

    /**
     * @return BelongsToMany<Page, $this>
     */
    public function featuredInPages(): BelongsToMany
    {
        return $this->belongsToMany(Page::class, 'page_featured_project')->withPivot('order');
    }

    public static function graphKind(): string
    {
        return 'project';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->where('hidden', false)->where('nda', false)->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->name ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url("/projects/{$this->slug}", $locale);
    }
}
