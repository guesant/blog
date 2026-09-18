<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditRequest extends Model
{
    const UPDATED_AT = null;

    protected $primaryKey = 'request_id';

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = ['request_id', 'method', 'path', 'ip', 'user_agent'];
}
