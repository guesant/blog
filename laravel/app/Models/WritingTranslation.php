<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WritingTranslation extends Model
{
    use Auditable, HasFactory;

    protected $fillable = ['writing_id', 'locale', 'title', 'excerpt', 'reading_time', 'body', 'seo'];

    protected $casts = ['seo' => 'array'];

    /**
     * @return BelongsTo<Writing, $this>
     */
    public function writing(): BelongsTo
    {
        return $this->belongsTo(Writing::class);
    }
}
