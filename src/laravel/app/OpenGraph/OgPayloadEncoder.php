<?php

namespace App\OpenGraph;

use InvalidArgumentException;

final class OgPayloadEncoder
{
    public function encode(OgPayload $payload): string
    {
        $json = json_encode(
            $payload->toArray(),
            JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
        );

        return $this->base64UrlEncode($json);
    }

    public function decode(string $encodedPayload): array
    {
        if ($encodedPayload === '' || preg_match('/\A[A-Za-z0-9_-]+\z/D', $encodedPayload) !== 1) {
            throw new InvalidArgumentException('The payload is not valid Base64URL.');
        }

        $padding = strlen($encodedPayload) % 4;
        if ($padding === 1) {
            throw new InvalidArgumentException('The payload has invalid Base64URL padding.');
        }

        $decoded = base64_decode(
            strtr($encodedPayload, '-_', '+/').str_repeat('=', (4 - $padding) % 4),
            true,
        );

        if ($decoded === false || $this->base64UrlEncode($decoded) !== $encodedPayload) {
            throw new InvalidArgumentException('The payload could not be decoded.');
        }

        try {
            $value = json_decode($decoded, true, 8, JSON_THROW_ON_ERROR | JSON_BIGINT_AS_STRING);
        } catch (\JsonException $exception) {
            throw new InvalidArgumentException('The payload is not valid JSON.', previous: $exception);
        }

        if (! is_array($value) || array_is_list($value)) {
            throw new InvalidArgumentException('The payload must be a JSON object.');
        }

        return $value;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
