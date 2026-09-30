<?php

namespace App\Support;

use App\Models\MediaAsset;

final class MediaAssetResolver
{
    public function find(string $disk, string $path): ?MediaAsset
    {
        return MediaAsset::query()
            ->where('disk', $disk)
            ->where('path', $path)
            ->first();
    }

    public function findAny(string $path): ?MediaAsset
    {
        return MediaAsset::query()->where('path', $path)->first();
    }

    public function findPublic(string $disk, string $path): ?MediaAsset
    {
        return MediaAsset::query()
            ->public()
            ->where('disk', $disk)
            ->where('path', $path)
            ->first();
    }

    public function findPublicByPath(string $path): ?MediaAsset
    {
        return MediaAsset::query()
            ->public()
            ->where('path', $path)
            ->first();
    }
}
