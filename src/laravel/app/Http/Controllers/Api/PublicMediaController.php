<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

final class PublicMediaController extends Controller
{
    public function __invoke(string $path): Response
    {
        $path = ltrim($path, '/');

        abort_unless(
            str_starts_with($path, 'content-attachments/') && ! str_contains($path, '..'),
            404,
        );

        $disk = Storage::disk((string) config('filesystems.default'));
        abort_unless($disk->exists($path), 404);

        $stream = $disk->readStream($path);
        abort_unless(is_resource($stream), 503);

        $contentType = $disk->mimeType($path) ?: 'application/octet-stream';
        $size = rescue(fn (): int => $disk->size($path), 0, false);
        $headers = [
            'Cache-Control' => 'public, max-age=31536000, immutable',
            'Content-Disposition' => 'inline',
            'Content-Type' => $contentType,
        ];

        if ($size > 0) {
            $headers['Content-Length'] = (string) $size;
        }

        return response()->stream(function () use ($stream): void {
            try {
                fpassthru($stream);
            } finally {
                fclose($stream);
            }
        }, 200, $headers);
    }
}
