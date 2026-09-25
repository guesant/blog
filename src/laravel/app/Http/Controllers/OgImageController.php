<?php

namespace App\Http\Controllers;

use App\OpenGraph\OgImageUrlSigner;
use App\OpenGraph\OgPayloadEncoder;
use App\OpenGraph\OgPayloadValidationException;
use App\OpenGraph\OgPayloadValidator;
use App\OpenGraph\OgRenderCapacityException;
use App\OpenGraph\OgRenderCoordinator;
use App\OpenGraph\OgRenderTimeoutException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class OgImageController extends Controller
{
    public function __construct(
        private readonly OgPayloadEncoder $encoder,
        private readonly OgImageUrlSigner $signer,
        private readonly OgPayloadValidator $validator,
        private readonly OgRenderCoordinator $coordinator,
    ) {}

    public function __invoke(Request $request, string $payload, string $signature): Response
    {
        if (! (bool) config('og.enabled')) {
            return response('OG image generation is disabled.', 404);
        }

        if (! is_string(config('og.secret')) || config('og.secret') === '') {
            return response('OG image generation is not configured.', 503)
                ->header('Retry-After', '60');
        }

        if (strlen($payload) > (int) config('og.max_payload_bytes')) {
            return response('The OG payload is too large.', 413);
        }

        if (strlen($signature) > (int) config('og.max_signature_bytes')) {
            return response('The OG signature is too large.', 413);
        }

        if (! $this->signer->verify($payload, $signature)) {
            return response('The OG signature is invalid.', 403);
        }

        try {
            $value = $this->encoder->decode($payload);
            $validated = $this->validator->validate($value);
        } catch (OgPayloadValidationException|\InvalidArgumentException) {
            return response('The OG payload is invalid.', 422);
        }

        try {
            $contents = $this->coordinator->render($validated, $payload);
        } catch (OgRenderCapacityException|OgRenderTimeoutException) {
            return response('The OG render capacity is temporarily exhausted.', 503)
                ->header('Retry-After', '2');
        } catch (\Throwable $exception) {
            report($exception);

            return response('The OG image could not be rendered.', 500);
        }

        $etag = '"'.hash('sha256', $contents).'"';
        if ($request->headers->get('If-None-Match') === $etag) {
            return response('', 304, [
                'Cache-Control' => 'public, max-age=31536000, immutable',
                'ETag' => $etag,
            ]);
        }

        return response($contents, 200, [
            'Cache-Control' => 'public, max-age=31536000, immutable',
            'Content-Type' => 'image/png',
            'Content-Length' => (string) strlen($contents),
            'ETag' => $etag,
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }
}
