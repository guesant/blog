<?php

namespace App\Models;

use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NavItem extends Model
{
    use HasFactory, UsesCurrentRevision;

    protected $fillable = ['route_name', 'parent_id', 'placement', 'sidebar_group', 'order'];

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
