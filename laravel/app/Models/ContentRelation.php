<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ContentRelation extends Model
{
    use HasFactory;

    protected $fillable = ['relation_type_id', 'subject_type', 'subject_id', 'object_type', 'object_id', 'note', 'context', 'status', 'visibility'];

    /**
     * @return BelongsTo<RelationType, $this>
     */
    public function relationType(): BelongsTo
    {
        return $this->belongsTo(RelationType::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function object(): MorphTo
    {
        return $this->morphTo();
    }
}
