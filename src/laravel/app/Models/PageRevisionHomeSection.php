<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageRevisionHomeSection extends Model
{
    protected $table = 'page_revision_home_sections';

    protected $guarded = [];

    protected $casts = [
        'enabled' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function pageRevision(): BelongsTo
    {
        return $this->belongsTo(PageRevision::class);
    }
}
