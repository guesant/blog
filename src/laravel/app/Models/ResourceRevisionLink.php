<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceRevisionLink extends Model
{
    protected $table = 'resource_revision_links';

    protected $guarded = [];

    protected $casts = ['is_primary' => 'boolean', 'is_free' => 'boolean'];
}
