<?php

namespace App\Support;

use LogicException;

final class PublicMediaSignature
{
    public function expiresAt(?int $expiresAt = null): int
    {
        return $expiresAt ?? time() + max(1, (int) config('portfolio.media_url_ttl_seconds', 86400));
    }

    public function sign(string $disk, string $path, int $expiresAt): string
    {
        return hash_hmac('sha256', $this->payload($disk, $path, $expiresAt), $this->key());
    }

    public function isValid(string $disk, string $path, ?int $expiresAt, ?string $signature): bool
    {
        if ($expiresAt === null || $expiresAt < time() || ! is_string($signature) || $signature === '') {
            return false;
        }

        foreach ($this->keys() as $key) {
            if (hash_equals($this->signWithKey($key, $disk, $path, $expiresAt), $signature)) {
                return true;
            }
        }

        return false;
    }

    private function payload(string $disk, string $path, int $expiresAt): string
    {
        return "GET\n{$expiresAt}\n{$disk}\n{$path}";
    }

    private function key(): string
    {
        $key = trim((string) config('portfolio.media_url_signing_key'));

        if ($key === '') {
            throw new LogicException('The public media signing key is not configured.');
        }

        return $key;
    }

    private function keys(): array
    {
        $keys = [$this->key()];
        $previous = trim((string) config('portfolio.media_url_previous_signing_key'));

        if ($previous !== '') {
            $keys[] = $previous;
        }

        return $keys;
    }

    private function signWithKey(string $key, string $disk, string $path, int $expiresAt): string
    {
        return hash_hmac('sha256', $this->payload($disk, $path, $expiresAt), $key);
    }
}
