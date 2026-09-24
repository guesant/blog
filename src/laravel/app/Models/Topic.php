<?php

namespace App\Models;

use App\Content\Graph\GraphNode;
use App\Content\Graph\InteractsWithGraph;
use App\Content\Locale;
use App\Content\PublicIdentifier;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * @method TopicRevisionTranslation|null translation(?string $locale = null)
 */
class Topic extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, InteractsWithGraph, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'order', 'kind', 'parent_id', 'hidden'];

    protected $casts = ['hidden' => 'boolean'];

    /**
     * @return BelongsTo<Topic, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Topic::class, 'parent_id');
    }

    /**
     * @return HasMany<Topic, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(Topic::class, 'parent_id');
    }

    /**
     * @return MorphToMany<resource, $this>
     */
    public function findings(): MorphToMany
    {
        return $this->morphedByMany(Resource::class, 'topicable')->withPivot('role');
    }

    /**
     * @return MorphToMany<Writing, $this>
     */
    public function writings(): MorphToMany
    {
        return $this->morphedByMany(Writing::class, 'topicable');
    }

    public static function graphKind(): string
    {
        return 'topic';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->name ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url('/topics/'.PublicIdentifier::key($this), $locale);
    }
}
