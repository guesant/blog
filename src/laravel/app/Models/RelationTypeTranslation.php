<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RelationTypeTranslation extends Model
{
    protected $fillable = ['relation_type_id', 'locale', 'outbound_label', 'inbound_label'];

    public function relationType(): BelongsTo
    {
        return $this->belongsTo(RelationType::class);
    }
}
