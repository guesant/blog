<?php

namespace App\Http\Controllers;

use App\Models\MediaAsset;
use App\Support\MediaAssetResponse;
use Symfony\Component\HttpFoundation\Response;

final class AdminMediaDownloadController extends Controller
{
    public function __invoke(MediaAsset $mediaAsset, MediaAssetResponse $response): Response
    {
        return $response->download($mediaAsset, 'private, no-store');
    }
}
