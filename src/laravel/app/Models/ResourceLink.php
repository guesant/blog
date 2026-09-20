<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ResourceLink extends Model
{
    use HasFactory;

    protected $fillable = ['resource_id', 'url', 'label', 'platform', 'purpose', 'is_primary', 'is_free', 'language_id'];

    protected $casts = ['is_primary' => 'boolean', 'is_free' => 'boolean'];

    /**
     * @return BelongsTo<resource, $this>
     */
    public function resource(): BelongsTo
    {
        return $this->belongsTo(Resource::class);
    }

    /**
     * @return BelongsTo<Language, $this>
     */
    public function language(): BelongsTo
    {
        return $this->belongsTo(Language::class);
    }
}
