<?php

namespace App\Models;

use App\Models\Concerns\UsesCurrentRevision;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method ProfileRevisionTranslation|null translation(?string $locale = null)
 */
class Profile extends Model
{
    use HasFactory, UsesCurrentRevision;

    protected $fillable = ['name', 'birth_date'];

    protected $casts = ['birth_date' => 'date'];
}
