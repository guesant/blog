<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method CreditEntryRevisionTranslation|null translation(?string $locale = null)
 */
class CreditEntry extends Model
{
    use Auditable, HasFactory, UsesCurrentRevision;

    protected $fillable = [
        'url', 'category', 'order',
        'is_automatic', 'active', 'package_manager', 'package_name',
    ];

    protected $casts = [
        'is_automatic' => 'boolean',
        'active' => 'boolean',
    ];
}
