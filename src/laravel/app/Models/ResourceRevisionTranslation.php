<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourceRevisionTranslation extends RevisionTranslation
{
    protected $table = 'resource_revision_translations';

    public function revision(): BelongsTo
    {
        return $this->belongsTo(ResourceRevision::class, 'resource_revision_id');
    }
}
