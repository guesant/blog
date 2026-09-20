<?php

namespace App\Models\Concerns;

use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

/**
 * Records a full old/new attribute snapshot into `audit_log` on every
 * create/update/delete of the model, correlated to the current HTTP
 * request via the `audit.request_id` binding set by
 * RequestAuditMiddleware (bound only on the Filament admin panel, since
 * that's the only place these models are ever written).
 */
trait Auditable
{
    protected static function bootAuditable(): void
    {
        static::created(function (Model $model) {
            static::writeAuditLog($model, 'created', null, $model->getAttributes());
        });

        static::updated(function (Model $model) {
            static::writeAuditLog($model, 'updated', $model->getOriginal(), $model->getAttributes());
        });

        static::deleted(function (Model $model) {
            static::writeAuditLog($model, 'deleted', $model->getOriginal(), null);
        });
    }

    protected static function writeAuditLog(Model $model, string $action, ?array $oldValues, ?array $newValues): void
    {
        $requestId = App::bound('audit.request_id') ? App::make('audit.request_id') : null;

        AuditLog::query()->create([
            'auditable_type' => $model::class,
            'auditable_id' => $model->getKey(),
            'action' => $action,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'request_id' => $requestId,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
