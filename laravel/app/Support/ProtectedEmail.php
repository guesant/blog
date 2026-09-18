<?php

namespace App\Support;

/**
 * Anti-scraping email obfuscation: the real address is never sent to the
 * browser in plain text. Instead we ship an AES-256-GCM ciphertext whose
 * key is derived via Argon2id from a public constant password + a random
 * per-challenge salt. The browser re-runs the same Argon2id derivation
 * (in a Web Worker, see resources/js/protected-email-worker.js) and
 * decrypts locally — no server round-trip at reveal time. This mirrors
 * the legacy Next.js app's protected-email mechanism (Argon2id KDF, not
 * a proof-of-work search), reimplemented for PHP/vanilla JS instead of
 * TypeScript/hash-wasm.
 *
 * The password constant below is deliberately public, like the original
 * — it is not a secret. Security comes from the random salt plus
 * Argon2id's memory-hardness, which makes each decrypt computationally
 * costly enough to deter naive bulk scraping without a server API call.
 */
class ProtectedEmail
{
    private const CHALLENGE_PASSWORD = 'portfolio-contact-challenge-v1';

    private const MEMORY_KIB = 262144; // 256 MiB

    private const ITERATIONS = 12; // ~6.5s measured in sandboxed browser testing; see commit body

    private const KEY_LENGTH = 32; // AES-256

    public static function encode(string $email): array
    {
        $salt = random_bytes(SODIUM_CRYPTO_PWHASH_SALTBYTES);
        $iv = random_bytes(12);

        $key = self::deriveKey($salt);

        $tag = '';
        $ciphertext = openssl_encrypt(
            $email,
            'aes-256-gcm',
            $key,
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
            '',
            16,
        );

        sodium_memzero($key);

        return [
            'version' => 1,
            'algorithm' => 'argon2id-aes256gcm',
            'salt' => self::toBase64Url($salt),
            'iv' => self::toBase64Url($iv),
            // Web Crypto's AES-GCM expects ciphertext and tag concatenated.
            'ciphertext' => self::toBase64Url($ciphertext.$tag),
            'params' => [
                'memoryKib' => self::MEMORY_KIB,
                'iterations' => self::ITERATIONS,
                'parallelism' => 1,
                'hashLength' => self::KEY_LENGTH,
            ],
        ];
    }

    private static function deriveKey(string $salt): string
    {
        return sodium_crypto_pwhash(
            self::KEY_LENGTH,
            self::CHALLENGE_PASSWORD,
            $salt,
            self::ITERATIONS,
            self::MEMORY_KIB * 1024,
            SODIUM_CRYPTO_PWHASH_ALG_ARGON2ID13,
        );
    }

    private static function toBase64Url(string $bytes): string
    {
        return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    }
}
