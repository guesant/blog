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
use Illuminate\Database\Eloquent\Relations\MorphToMany;

/**
 * @method WritingTranslation|null translation(?string $locale = null)
 */
class Writing extends Model implements GraphNode
{
    use Auditable, HasFactory, HasPublicId, HasTranslations, InteractsWithGraph;

    protected $fillable = ['slug', 'public_id', 'hidden', 'date_iso', 'type', 'show_history'];

    protected $casts = ['hidden' => 'boolean', 'date_iso' => 'date', 'show_history' => 'boolean'];

    /**
     * @return HasMany<WritingTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(WritingTranslation::class);
    }

    /**
     * @return MorphToMany<Topic, $this>
     */
    public function topics(): MorphToMany
    {
        return $this->morphToMany(Topic::class, 'topicable');
    }

    /**
     * @return BelongsToMany<Page, $this>
     */
    public function featuredInPages(): BelongsToMany
    {
        return $this->belongsToMany(Page::class, 'page_featured_writing')->withPivot('order');
    }

    public static function graphKind(): string
    {
        return 'writing';
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
        return Locale::url("/writing/{$this->slug}", $locale);
    }
}
