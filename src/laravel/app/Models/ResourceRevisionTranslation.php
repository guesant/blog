<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourceRevisionTranslation extends Model
{
    protected $table = 'resource_revision_translations';

    protected $guarded = [];

    public function revision(): BelongsTo
    {
        return $this->belongsTo(ResourceRevision::class, 'resource_revision_id');
    }
}
