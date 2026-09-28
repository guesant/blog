<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CreditCategoryTranslation extends Model
{
    protected $fillable = ['credit_category_id', 'locale', 'name'];

    public function creditCategory(): BelongsTo
    {
        return $this->belongsTo(CreditCategory::class);
    }
}
