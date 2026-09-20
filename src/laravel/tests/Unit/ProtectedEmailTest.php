<?php

namespace Tests\Unit;

use App\Support\ProtectedEmail;
use PHPUnit\Framework\TestCase;

class ProtectedEmailTest extends TestCase
{
    public function test_it_generates_the_frontend_challenge_contract(): void
    {
        $challenge = ProtectedEmail::encode('someone@example.com');

        $this->assertSame(2, $challenge['version']);
        $this->assertSame('argon2id-aes256gcm', $challenge['algorithm']);
        $this->assertArrayHasKey('salt', $challenge);
        $this->assertArrayHasKey('iv', $challenge);
        $this->assertArrayHasKey('ciphertext', $challenge);
        $this->assertSame([
            'memorySize' => 19 * 1024,
            'iterations' => 3,
            'parallelism' => 1,
            'hashLength' => 32,
        ], $challenge['params']);
    }
}
