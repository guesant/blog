<?php

namespace App\Support;

use App\Models\MediaAsset;

final class AdminMediaUrl
{
    public function forAsset(MediaAsset $asset): string
    {
        return route('admin.media.download', ['mediaAsset' => $asset]);
    }

    public function forPath(string $path, ?string $disk = null): ?string
    {
        $resolver = app(MediaAssetResolver::class);
        $asset = $disk === null ? $resolver->findAny($path) : $resolver->find($disk, $path);

        return $asset === null ? null : $this->forAsset($asset);
    }
}
