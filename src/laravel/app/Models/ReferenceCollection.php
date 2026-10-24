<?php

namespace App\Models;

use App\Models\Concerns\AssignsNextOrder;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method ReferenceCollectionRevisionTranslation|null translation(?string $locale = null)
 */
class ReferenceCollection extends Model
{
    use AssignsNextOrder, Auditable, HasFactory, HasPublicId, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'hidden', 'order', 'image', 'published_at'];

    protected $casts = ['hidden' => 'boolean', 'published_at' => 'date'];
}
