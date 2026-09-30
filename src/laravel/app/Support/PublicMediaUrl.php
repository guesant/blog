<?php

namespace App\Support;

final class PublicMediaUrl
{
    public function __construct(
        private readonly PublicMediaSignature $signature,
        private readonly MediaAssetResolver $assets,
    ) {}

    public function url(string $path, ?int $expiresAt = null): ?string
    {
        $path = ltrim($path, '/');

        if (! str_starts_with($path, 'content-attachments/')) {
            return null;
        }

        $asset = $this->assets->findPublicByPath($path);

        if ($asset === null) {
            return null;
        }

        $expiresAt = $this->signature->expiresAt($expiresAt);
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $query = http_build_query([
            'disk' => $asset->disk,
            'expires' => $expiresAt,
            'signature' => $this->signature->sign($asset->disk, $path, $expiresAt),
        ], '', '&', PHP_QUERY_RFC3986);

        return rtrim((string) config('portfolio.public_media_url'), '/')."/{$encodedPath}?{$query}";
    }

    public function rewrite(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map(fn (mixed $item): mixed => $this->rewrite($item), $value);
        }

        if (! is_string($value)) {
            return $value;
        }

        return preg_replace_callback(
            '~https?://[^\\s<>()"]+/(?:portfolio/)?(content-attachments/[^\\s<>()"?#]+)~',
            fn (array $matches): string => $this->url($matches[1]) ?? '',
            $value,
        ) ?? $value;
    }
}
