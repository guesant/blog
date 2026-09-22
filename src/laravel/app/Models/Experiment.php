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
 * @method ExperimentRevisionTranslation|null translation(?string $locale = null)
 */
class Experiment extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, InteractsWithGraph, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'href', 'external', 'published_at', 'show_history'];

    protected $casts = ['hidden' => 'boolean', 'external' => 'boolean', 'published_at' => 'date', 'show_history' => 'boolean'];

    /**
     * @return BelongsToMany<Technology, $this>
     */
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'experiment_technology')->withPivot('order')->orderByPivot('order');
    }

    public static function graphKind(): string
    {
        return 'experiment';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->where('hidden', false)->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->name ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url("/projects/experiments/{$this->slug}", $locale);
    }
}
