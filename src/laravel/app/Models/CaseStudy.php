<?php

namespace App\Models;

use App\Content\Graph\GraphNode;
use App\Content\Graph\InteractsWithGraph;
use App\Content\Locale;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property bool $show_history
 *
 * @method CaseStudyRevisionTranslation|null translation(?string $locale = null)
 */
class CaseStudy extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, InteractsWithGraph, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'visual', 'nda', 'published_at', 'show_history'];

    protected $casts = ['hidden' => 'boolean', 'external' => 'boolean', 'nda' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'];

    /**
     * @return BelongsToMany<Technology, $this>
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'case_study_technology')->withPivot('order')->orderByPivot('order');
    }

    /**
     * @return BelongsToMany<Resume, $this>
     */
    public function resumeSelectedCases(): BelongsToMany
    {
        return $this->belongsToMany(Resume::class, 'resume_selected_case')->withPivot('order');
    }

    /**
     * @return BelongsToMany<Page, $this>
     */
    public function featuredInPages(): BelongsToMany
    {
        return $this->belongsToMany(Page::class, 'page_featured_case')->withPivot('order');
    }

    public static function graphKind(): string
    {
        return 'case-study';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->where('hidden', false)->where('nda', false)->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->title ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url("/cases/{$this->slug}", $locale);
    }
}
