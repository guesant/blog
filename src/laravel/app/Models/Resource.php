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
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * @method ResourceRevisionTranslation|null translation(?string $locale = null)
 */
class Resource extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, InteractsWithGraph, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'type', 'language_id', 'published_date_iso', 'found_date_iso', 'consumption_state', 'rating', 'editorial_state', 'visibility', 'featured', 'featured_order', 'popularity_kind', 'popularity_rank', 'popularity_value'];

    protected $casts = ['hidden' => 'boolean', 'published_date_iso' => 'date', 'found_date_iso' => 'date', 'featured' => 'boolean', 'popularity_rank' => 'float'];

    /**
     * @return BelongsTo<Language, $this>
     */
    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }

    /**
     * @return HasMany<ResourceLink, $this>
     */
    public function links(): HasMany
    {
        return $this->hasMany(ResourceLink::class);
    }

    /**
     * @return HasMany<ResourceIdentifier, $this>
     */
    public function identifiers(): HasMany
    {
        return $this->hasMany(ResourceIdentifier::class);
    }

    /**
     * @return MorphToMany<Topic, $this>
     */
    public function topics(): MorphToMany
    {
        return $this->morphToMany(Topic::class, 'topicable')->withPivot('role');
    }

    /**
     * @return BelongsToMany<Topic, $this>
     */
    public function authorTopics(): BelongsToMany
    {
        return $this->attributionTopics('authored-by');
    }

    /**
     * @return BelongsToMany<Topic, $this>
     */
    public function publisherTopics(): BelongsToMany
    {
        return $this->attributionTopics('published-by');
    }

    /**
     * @return BelongsToMany<Topic, $this>
     */
    private function attributionTopics(string $relationTypeKey): BelongsToMany
    {
        $relationTypeId = RelationType::where('key', $relationTypeKey)->value('id');

        $query = $this->belongsToMany(Topic::class, 'content_relations', 'subject_id', 'object_id')
            ->wherePivot('subject_type', $this->getMorphClass())
            ->wherePivot('object_type', (new Topic)->getMorphClass());

        if ($relationTypeId === null) {
            return $query->whereRaw('1 = 0');
        }

        return $query
            ->wherePivot('relation_type_id', $relationTypeId)
            ->withPivotValue('subject_type', $this->getMorphClass())
            ->withPivotValue('object_type', (new Topic)->getMorphClass())
            ->withPivotValue('relation_type_id', $relationTypeId);
    }

    /**
     * @return BelongsToMany<ReferenceCollection, $this>
     */
    public function referenceCollections(): BelongsToMany
    {
        return $this->belongsToMany(ReferenceCollection::class, 'reference_collection_item')->withPivot('note', 'order');
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('hidden', false)->where('visibility', 'public');
    }

    public static function graphKind(): string
    {
        return 'finding';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->public()->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->title ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url('/findings/'.PublicIdentifier::key($this), $locale);
    }

    public function graphMeta(): array
    {
        return ['type' => $this->type];
    }
}
