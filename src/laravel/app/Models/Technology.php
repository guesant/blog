<?php

namespace App\Models;

use App\Models\Concerns\AssignsNextOrder;
use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicId;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method TechnologyRevisionTranslation|null translation(?string $locale = null)
 * @method static \Illuminate\Database\Eloquent\Builder published()
 */
class Technology extends Model
{
    use AssignsNextOrder, Auditable, HasFactory, HasPublicId, UsesCurrentRevision;

    protected $fillable = ['slug', 'public_id', 'order', 'code', 'logo', 'hidden'];

    protected $casts = ['hidden' => 'boolean'];
}
