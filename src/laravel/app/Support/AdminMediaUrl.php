<?php

namespace App\Support;

use App\Models\MediaAsset;

final class AdminMediaUrl
{
    public function forAsset(MediaAsset $asset, bool $inline = false): string
    {
        $url = route('admin.media.download', ['mediaAsset' => $asset]);

        if ($inline) {
            $url .= '?inline=1';
        }

        if (app()->environment('production') && str_starts_with($url, 'http://')) {
            return 'https://'.substr($url, 7);
        }

        return $url;
    }

    public function forPath(string $path, ?string $disk = null, bool $inline = false): ?string
    {
        $resolver = app(MediaAssetResolver::class);
        $asset = $disk === null ? $resolver->findAny($path) : $resolver->find($disk, $path);

        return $asset === null ? null : $this->forAsset($asset, $inline);
    }
}
