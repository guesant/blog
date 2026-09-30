<?php

namespace App\Support;

use App\Models\MediaAsset;
use Illuminate\Support\Facades\Storage;

final class MediaAssetRegistrar
{
    public function register(
        string $disk,
        string $path,
        ?string $originalName = null,
        ?string $mimeType = null,
        ?int $size = null,
        ?string $checksum = null,
        string $visibility = 'private',
    ): MediaAsset {
        $storage = Storage::disk($disk);
        $size ??= rescue(fn () => $storage->size($path), null, false);
        $mimeType ??= rescue(fn () => $storage->mimeType($path), null, false);

        return MediaAsset::query()->updateOrCreate(
            ['disk' => $disk, 'path' => $path],
            [
                'original_name' => $originalName,
                'mime_type' => $mimeType,
                'size' => $size,
                'checksum' => $checksum,
                'visibility' => $visibility,
            ],
        );
    }
}
