<?php

namespace App\Support;

use App\Models\MediaAsset;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

final class MediaAssetResponse
{
    public function download(MediaAsset $asset, string $cacheControl): Response
    {
        abort_unless(array_key_exists($asset->disk, (array) config('filesystems.disks', [])), 404);

        $storage = Storage::disk($asset->disk);

        abort_unless($storage->exists($asset->path), 404);

        $stream = $storage->readStream($asset->path);
        abort_unless(is_resource($stream), 503);

        $contentType = $asset->mime_type ?: $storage->mimeType($asset->path) ?: 'application/octet-stream';
        $size = rescue(fn (): int => $storage->size($asset->path), 0, false);
        $headers = [
            'Cache-Control' => $cacheControl,
            'Content-Disposition' => 'attachment',
            'Content-Type' => $contentType,
            'X-Content-Type-Options' => 'nosniff',
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
