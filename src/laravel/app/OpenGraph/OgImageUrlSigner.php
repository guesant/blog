<?php

namespace App\OpenGraph;

final class OgImageUrlSigner
{
    public function signature(string $encodedPayload): string
    {
        return $this->base64UrlEncode(hash_hmac('sha256', $encodedPayload, $this->secret(), true));
    }

    public function verify(string $encodedPayload, string $signature): bool
    {
        if (preg_match('/\A[A-Za-z0-9_-]{43}\z/D', $signature) !== 1) {
            return false;
        }

        return hash_equals($this->signature($encodedPayload), $signature);
    }

    private function secret(): string
    {
        $secret = config('og.secret');
        if (! is_string($secret) || $secret === '') {
            throw new \RuntimeException('OG_IMAGE_SECRET is not configured.');
        }

        return $secret;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
