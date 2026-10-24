<?php

namespace App\Models;

use App\Models\Concerns\AssignsNextOrder;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * @method TopicRevisionTranslation|null translation(?string $locale = null)
 * @method static \Illuminate\Database\Eloquent\Builder published()
 */
class Topic extends Model
{
    use AssignsNextOrder, Auditable, HasFactory, HasPublicId, UsesCurrentRevision;

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
     * @return MorphToMany<Writing, $this>
     */
    public function writings(): MorphToMany
    {
        return $this->morphedByMany(Writing::class, 'topicable');
    }
}
