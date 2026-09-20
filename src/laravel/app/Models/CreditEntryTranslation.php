<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditEntryTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['credit_entry_id', 'locale', 'name', 'description'];

    /**
     * @return BelongsTo<CreditEntry, $this>
     */
    public function creditEntry(): BelongsTo
    {
        return $this->belongsTo(CreditEntry::class);
    }
}
