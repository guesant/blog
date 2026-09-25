<?php

namespace Tests\Unit\OpenGraph;

use App\OpenGraph\OgImageUrlSigner;
use App\OpenGraph\OgPayload;
use App\OpenGraph\OgPayloadEncoder;
use App\OpenGraph\OgPayloadValidationException;
use App\OpenGraph\OgPayloadValidator;
use Tests\TestCase;

final class OgPayloadTest extends TestCase
{
    public function test_payload_encoding_is_deterministic_and_supports_unicode(): void
    {
        $payload = new OgPayload(1, 'article', 'Título', 'Descrição');
        $encoder = app(OgPayloadEncoder::class);

        $encoded = $encoder->encode($payload);

        $this->assertSame($encoded, $encoder->encode($payload));
        $this->assertSame($payload->toArray(), $encoder->decode($encoded));
        $this->assertStringNotContainsString('=', $encoded);
        $this->assertMatchesRegularExpression('/\A[A-Za-z0-9_-]+\z/', $encoded);
    }

    public function test_signature_rejects_tampered_payload(): void
    {
        config(['og.secret' => 'test-secret']);
        $encoder = app(OgPayloadEncoder::class);
        $signer = app(OgImageUrlSigner::class);
        $encoded = $encoder->encode(new OgPayload(1, 'article', 'Título'));
        $signature = $signer->signature($encoded);

        $this->assertTrue($signer->verify($encoded, $signature));
        $this->assertFalse($signer->verify($encoded.'x', $signature));
    }

    public function test_validator_rejects_unknown_fields_and_invalid_templates(): void
    {
        $validator = app(OgPayloadValidator::class);

        $this->expectException(OgPayloadValidationException::class);
        $validator->validate([
            'v' => 1,
            'template' => 'unknown',
            'title' => 'Title',
            'extra' => true,
        ]);
    }
}
