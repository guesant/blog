<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Platform extends Model
{
    use HasFactory;

    protected $fillable = ['slug', 'label'];

    /**
     * @return HasMany<ContactProfile, $this>
     */
    public function contactProfiles(): HasMany
    {
        return $this->hasMany(ContactProfile::class);
    }
}
