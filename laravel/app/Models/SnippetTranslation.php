<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SnippetTranslation extends Model
{
    use Auditable, HasFactory;

    protected $fillable = ['snippet_id', 'locale', 'title', 'description'];

    /**
     * @return BelongsTo<Snippet, $this>
     */
    public function snippet(): BelongsTo
    {
        return $this->belongsTo(Snippet::class);
    }
}
