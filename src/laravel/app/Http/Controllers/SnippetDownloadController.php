<?php

namespace App\Http\Controllers;

use App\Models\Snippet;
use App\Support\SnippetArchiveBuilder;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SnippetDownloadController extends Controller
{
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
            return response()->json([
                'title' => 'Snippet download unavailable',
                'detail' => 'The public snippet files do not satisfy the archive safety limits.',
            ], 422);
        }

        return response($archive, 200, [
            'Content-Type' => 'application/zip',
            'Content-Disposition' => 'attachment; filename="'.addslashes($snippet->slug).'.zip"',
            'Cache-Control' => 'no-store',
        ]);
    }
}
