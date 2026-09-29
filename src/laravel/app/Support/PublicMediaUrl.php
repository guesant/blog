<?php

namespace App\Support;

final class PublicMediaUrl
{
    public function rewrite(mixed $value): mixed
    {
        if (is_array($value)) {
            return array_map(fn (mixed $item): mixed => $this->rewrite($item), $value);
        }

        if (! is_string($value)) {
            return $value;
        }

        $baseUrl = (string) config('portfolio.public_media_url');

        return preg_replace_callback(
            '~https?://[^\\s<>()"]+/(?:portfolio/)?(content-attachments/[^\\s<>()"]+)~',
            static fn (array $matches): string => rtrim($baseUrl, '/').'/'.$matches[1],
            $value,
        ) ?? $value;
    }
}
