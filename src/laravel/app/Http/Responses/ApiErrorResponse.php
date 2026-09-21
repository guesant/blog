<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

final class ApiErrorResponse
{
    public static function make(
        ApiErrorCode $code,
        int $status,
        string $message,
        array $details = [],
    ): JsonResponse {
        return response()->json([
            'error' => [
                'code' => $code->value,
                'message' => $message,
                'status' => $status,
                'details' => $details,
            ],
        ], $status);
    }

    public static function fromThrowable(Throwable $exception): JsonResponse
    {
        $status = $exception instanceof ValidationException
            ? 422
            : ($exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500);

        $details = $exception instanceof ValidationException
            ? ['fields' => $exception->errors()]
            : [];

        return self::make(
            self::codeForStatus($status),
            $status,
            self::messageForStatus($status),
            $details,
        );
    }

    private static function codeForStatus(int $status): ApiErrorCode
    {
        return match ($status) {
            400 => ApiErrorCode::BadRequest,
            401 => ApiErrorCode::Unauthenticated,
            403 => ApiErrorCode::Forbidden,
            404 => ApiErrorCode::NotFound,
            405 => ApiErrorCode::MethodNotAllowed,
            408 => ApiErrorCode::RequestTimeout,
            409 => ApiErrorCode::Conflict,
            410 => ApiErrorCode::Gone,
            419 => ApiErrorCode::CsrfTokenMismatch,
            422 => ApiErrorCode::ValidationFailed,
            429 => ApiErrorCode::TooManyRequests,
            503 => ApiErrorCode::ServiceUnavailable,
            default => $status >= 500 ? ApiErrorCode::InternalServerError : ApiErrorCode::RequestFailed,
        };
    }

    private static function messageForStatus(int $status): string
    {
        return match ($status) {
            400 => 'The request is invalid.',
            401 => 'Authentication is required.',
            403 => 'You are not authorized to perform this action.',
            404 => 'The requested resource was not found.',
            405 => 'The requested method is not allowed.',
            408 => 'The request timed out.',
            409 => 'The request conflicts with the current state.',
            410 => 'The requested resource is no longer available.',
            419 => 'The request token is invalid or expired.',
            422 => 'The request contains invalid data.',
            429 => 'Too many requests.',
            503 => 'The service is temporarily unavailable.',
            default => $status >= 500 ? 'An internal server error occurred.' : 'The request could not be processed.',
        };
    }
}
