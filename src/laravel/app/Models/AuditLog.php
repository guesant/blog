<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class AuditLog extends Model
{
    const UPDATED_AT = null;

    protected $table = 'audit_log';

    protected $fillable = [
        'auditable_type',
        'auditable_id',
        'action',
        'old_values',
        'new_values',
        'request_id',
        'ip',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return BelongsTo<AuditRequest, $this>
     */
    public function request(): BelongsTo
    {
        return $this->belongsTo(AuditRequest::class, 'request_id', 'request_id');
    }
}
