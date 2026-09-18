<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RelationType extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'family', 'symmetric', 'outbound_label_en', 'outbound_label_pt_br', 'inbound_label_en', 'inbound_label_pt_br'];

    /**
     * @return HasMany<ContentRelation, $this>
     */
    public function contentRelations(): HasMany
    {
        return $this->hasMany(ContentRelation::class);
    }
}
