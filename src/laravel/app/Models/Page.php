<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method PageRevisionTranslation|null translation(?string $locale = null)
 */
class Page extends Model
{
    use Auditable, HasFactory, UsesCurrentRevision;

    protected $fillable = ['slug', 'hidden'];

    protected $casts = ['hidden' => 'boolean'];
}
