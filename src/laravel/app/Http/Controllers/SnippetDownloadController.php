<?php

namespace App\Http\Controllers;

use App\Application\PublicSite\DownloadPublicSnippet;
use App\Application\PublicSite\DownloadPublicSnippetHandler;
use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\Http\Responses\PublicSnippetDownloadResponseDto;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SnippetDownloadController extends Controller
{
    /** @response string */
    #[ScrambleResponse(200, type: 'string')]
    #[ScrambleResponse(422, 'The public snippet files do not satisfy the archive safety limits.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function __invoke(Request $request, string $slug, DownloadPublicSnippetHandler $handler): Response
    {
        try {
            $result = $handler->handle(new DownloadPublicSnippet(
                slug: $slug,
                selectedFileIds: collect($request->query('files', []))
                    ->filter(fn ($id) => is_scalar($id) && (string) $id !== '')
                    ->map(fn ($id) => (string) $id)
                    ->values()
                    ->all(),
            ));

            abort_unless($result !== null, 404);
        } catch (\RuntimeException) {
            return ApiErrorResponse::make(
                ApiErrorCode::SnippetDownloadUnavailable,
                422,
                'The public snippet files do not satisfy the archive safety limits.',
            );
        }

        $response = PublicSnippetDownloadResponseDto::fromResult($result);

        return response($response->contents(), 200, [
            'Content-Type' => 'application/zip',
            'Content-Disposition' => 'attachment; filename="'.addslashes($response->filename()).'"',
            'Cache-Control' => 'no-store',
        ]);
    }
}
