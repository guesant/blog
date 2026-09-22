<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceRevisionAttribution extends Model
{
    protected $table = 'resource_revision_attributions';

    public $timestamps = false;

    protected $guarded = [];
}
