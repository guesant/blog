<?php

namespace App\Http\Responses;

enum ApiErrorCode: string
{
    case BadRequest = 'bad_request';
    case Unauthenticated = 'unauthenticated';
    case Forbidden = 'forbidden';
    case NotFound = 'not_found';
    case MethodNotAllowed = 'method_not_allowed';
    case RequestTimeout = 'request_timeout';
    case Conflict = 'conflict';
    case Gone = 'gone';
    case CsrfTokenMismatch = 'csrf_token_mismatch';
    case ValidationFailed = 'validation_failed';
    case TooManyRequests = 'too_many_requests';
    case ServiceUnavailable = 'service_unavailable';
    case InternalServerError = 'internal_server_error';
    case RequestFailed = 'request_failed';
    case Maintenance = 'maintenance';
    case ResourceRequired = 'resource_required';
    case SnippetDownloadUnavailable = 'snippet_download_unavailable';
}
