<?php

namespace App\Support;

use App\Models\MediaAsset;

final class PublicMediaUrl
{
    /** @psalm-suppress PossiblyUnusedMethod */
    public function __construct(
        private readonly PublicMediaSignature $signature,
        private readonly MediaAssetResolver $assets,
    ) {}

    public function url(
        string $path,
        ?int $expiresAt = null,
        bool $inline = false,
    ): ?string {
        $path = ltrim($path, '/');

        if (! str_starts_with($path, 'content-attachments/')) {
            return null;
        }

        $asset = $this->assets->findPublicByPath($path);

        if ($asset === null) {
            return null;
        }

        return $this->urlForAsset($asset, $expiresAt, $inline);
    }

    private function urlForAsset(
        MediaAsset $asset,
        ?int $expiresAt,
        bool $inline,
    ): string {
        $path = ltrim($asset->path, '/');
        $expiresAt = $this->signature->expiresAt($expiresAt);
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $path)));
        $parameters = [
            'disk' => $asset->disk,
            'expires' => $expiresAt,
            'signature' => $this->signature->sign($asset->disk, $path, $expiresAt),
        ];

        if ($inline) {
            $parameters['inline'] = '1';
        }

        $query = http_build_query($parameters, '', '&', PHP_QUERY_RFC3986);

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

        $adminPath = preg_quote(trim((string) config('admin.path'), '/'), '~');
        $source = '(?:https?://[^\\s<>()"]+/(?:portfolio/)?content-attachments/[^\\s<>()"?#]+|'
            .'https?://[^\\s<>()"]+/'.$adminPath.'/media/[0-9]+/download)';

        $value = preg_replace_callback(
            '~(!\\[[^\\]]*\\]\\(\\s*<?)('.$source.')(>?\\s*\\))~',
            fn (array $matches): string => $matches[1]
                .($this->rewriteUrl($matches[2], true) ?? '')
                .$matches[3],
            $value,
        ) ?? $value;

        return preg_replace_callback(
            '~'.$source.'~',
            fn (array $matches): string => $this->rewriteUrl($matches[0], false) ?? '',
            $value,
        ) ?? $value;
    }

    private function rewriteUrl(string $url, bool $inline): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);

        if (! is_string($path)) {
            return null;
        }

        $adminPath = preg_quote(trim((string) config('admin.path'), '/'), '~');

        if (preg_match('~/'.$adminPath.'/media/([0-9]+)/download$~', $path, $matches) === 1) {
            $asset = $this->assets->findPublicById((int) $matches[1]);

            return $asset === null ? null : $this->url($asset->path, null, $inline);
        }

        if (preg_match('~/(?:portfolio/)?(content-attachments/[^?#]+)$~', $path, $matches) !== 1) {
            return null;
        }

        return $this->url(rawurldecode($matches[1]), null, $inline);
    }
}
