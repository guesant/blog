<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SidebarGroupTranslation extends Model
{
    protected $fillable = ['sidebar_group_id', 'locale', 'label'];

    public function sidebarGroup(): BelongsTo
    {
        return $this->belongsTo(SidebarGroup::class);
    }
}
