<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourceTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['resource_id', 'locale', 'title', 'alternative_title', 'description', 'personal_note', 'reason_found', 'seo'];

    protected $casts = ['seo' => 'array'];

    /**
     * @return BelongsTo<resource, $this>
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }
}
