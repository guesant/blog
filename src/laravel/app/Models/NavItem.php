<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method NavItemTranslation|null translation(?string $locale = null)
 */
class NavItem extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = ['route_name', 'parent_id', 'placement', 'sidebar_group', 'order'];

    /**
     * @return HasMany<NavItemTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(NavItemTranslation::class);
    }

    /**
     * @return BelongsTo<NavItem, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(NavItem::class, 'parent_id');
    }

    /**
     * @return HasMany<NavItem, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(NavItem::class, 'parent_id')->orderBy('order');
    }
}
