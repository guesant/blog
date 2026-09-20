<?php

namespace App\Models;

use App\Content\Graph\GraphNode;
use App\Content\Graph\InteractsWithGraph;
use App\Content\Locale;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method ReferenceCollectionTranslation|null translation(?string $locale = null)
 */
class ReferenceCollection extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, HasTranslations, InteractsWithGraph;

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'image', 'published_at'];

    protected $casts = ['hidden' => 'boolean', 'published_at' => 'date'];

    /**
     * @return HasMany<ReferenceCollectionTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(ReferenceCollectionTranslation::class);
    }

    /**
     * @return BelongsToMany<resource, $this>
     */
    public function resources(): BelongsToMany
    {
        return $this->belongsToMany(Resource::class, 'reference_collection_item')->withPivot('note', 'order');
    }

    public static function graphKind(): string
    {
        return 'collection';
    }

    public static function graphNodesQuery(): Builder
    {
        return static::query()->where('hidden', false)->with('translations');
    }

    public function graphLabel(string $locale): string
    {
        return $this->translation($locale)->title ?? $this->slug;
    }

    public function graphUrl(string $locale): ?string
    {
        return Locale::url("/collections/{$this->slug}", $locale);
    }
}
