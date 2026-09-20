<?php

namespace App\Http\Middleware;

use App\Models\AuditRequest;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tags every request into the Filament admin panel with a request_id
 * (reused from the X-Request-Id header when a caller already provides
 * one), logs it in `audit_requests`, and binds it into the container so
 * Auditable (app/Models/Concerns/Auditable.php) can correlate every
 * audit_log row written during this request back to it.
 */
class RequestAuditMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $requestId = $request->header('X-Request-Id') ?: (string) Str::uuid();

        app()->instance('audit.request_id', $requestId);

        AuditRequest::query()->create([
            'request_id' => $requestId,
            'method' => $request->method(),
            'path' => $request->path(),
            'ip' => $request->ip(),
            'user_agent' => (string) $request->userAgent(),
        ]);

        return $next($request);
    }
}
