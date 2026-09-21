<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiErrorCode;
use App\Http\Responses\ApiErrorResponse;
use App\Models\Snippet;
use App\Support\SnippetArchiveBuilder;
use Dedoc\Scramble\Attributes\Response as ScrambleResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SnippetDownloadController extends Controller
{
    /** @response string */
    #[ScrambleResponse(422, 'The public snippet files do not satisfy the archive safety limits.', type: 'array{error: array{code: string, message: string, status: int, details: string}}')]
    public function __invoke(Request $request, string $slug, SnippetArchiveBuilder $builder): Response
    {
        $snippet = Snippet::where('slug', $slug)
            ->where('hidden', false)
            ->with('files')
            ->firstOrFail();

        try {
            $archive = $builder->build(
                $snippet,
                collect($request->query('files', []))
                    ->filter(fn ($id) => is_scalar($id) && (string) $id !== '')
                    ->map(fn ($id) => (string) $id)
                    ->values()
                    ->all(),
            );
        } catch (\RuntimeException) {
            return ApiErrorResponse::make(
                ApiErrorCode::SnippetDownloadUnavailable,
                422,
                'The public snippet files do not satisfy the archive safety limits.',
            );
        }

        return response($archive, 200, [
            'Content-Type' => 'application/zip',
            'Content-Disposition' => 'attachment; filename="'.addslashes($snippet->slug).'.zip"',
            'Cache-Control' => 'no-store',
        ]);
    }
}
