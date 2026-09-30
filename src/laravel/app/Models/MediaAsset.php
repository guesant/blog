<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'disk',
        'path',
        'original_name',
        'mime_type',
        'size',
        'checksum',
        'visibility',
        'last_referenced_at',
    ];

    protected function casts(): array
    {
        return [
            'size' => 'integer',
            'last_referenced_at' => 'datetime',
        ];
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('visibility', 'public');
    }
}
