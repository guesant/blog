<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SnippetFile extends Model
{
    use Auditable, HasFactory;

    protected $fillable = ['snippet_id', 'path', 'language', 'content', 'order'];

    /**
     * @return BelongsTo<Snippet, $this>
     */
    public function snippet(): BelongsTo
    {
        return $this->belongsTo(Snippet::class);
    }
}
