<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NavItemTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['nav_item_id', 'locale', 'label'];

    /**
     * @return BelongsTo<NavItem, $this>
     */
    public function navItem(): BelongsTo
    {
        return $this->belongsTo(NavItem::class);
    }
}
