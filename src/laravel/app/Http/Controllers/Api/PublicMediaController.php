<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\MediaAssetResolver;
use App\Support\MediaAssetResponse;
use App\Support\PublicMediaSignature;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class PublicMediaController extends Controller
{
    public function __invoke(
        Request $request,
        string $path,
    ): Response {
        $signature = app(PublicMediaSignature::class);
        $assets = app(MediaAssetResolver::class);
        $response = app(MediaAssetResponse::class);
        $path = ltrim($path, '/');

        abort_unless(
            str_starts_with($path, 'content-attachments/')
                && ! str_contains($path, '..')
                && ! str_contains($path, '\\')
                && ! preg_match('/[\x00-\x1F\x7F]/', $path)
                && strlen($path) <= 1024,
            404,
        );
        $disk = $request->query('disk');
        $expires = $request->query('expires');
        $expiresAt = is_string($expires) && ctype_digit($expires) ? (int) $expires : null;
        $providedSignature = $request->query('signature');
        abort_unless(
            $signature->isValid(
                is_string($disk) ? $disk : '',
                $path,
                $expiresAt,
                is_string($providedSignature) ? $providedSignature : null,
            ),
            404,
        );

        $asset = $assets->findPublic(is_string($disk) ? $disk : '', $path);
        abort_unless($asset !== null, 404);

        $maxAge = $expiresAt === null ? 0 : max(0, $expiresAt - time());

        return $response->download($asset, "public, max-age={$maxAge}");
    }
}
