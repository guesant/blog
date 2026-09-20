<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReferenceCollectionTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['reference_collection_id', 'locale', 'title', 'description', 'intro', 'seo'];

    protected $casts = ['seo' => 'array'];

    /**
     * @return BelongsTo<ReferenceCollection, $this>
     */
    public function referenceCollection(): BelongsTo
    {
        return $this->belongsTo(ReferenceCollection::class);
    }
}
