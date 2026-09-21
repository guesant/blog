<?php

namespace App\Support;

class ProtectedEmail
{
    private const CHALLENGE_PASSWORD = 'portfolio-contact-challenge-v1';

    private const MEMORY_KIB = 19 * 1024;

    private const ITERATIONS = 3;

    private const KEY_LENGTH = 32;

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
            'version' => 2,
            'algorithm' => 'argon2id-aes256gcm',
            'salt' => self::toBase64Url($salt),
            'iv' => self::toBase64Url($iv),
            'ciphertext' => self::toBase64Url($ciphertext.$tag),
            'params' => [
                'memorySize' => self::MEMORY_KIB,
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
