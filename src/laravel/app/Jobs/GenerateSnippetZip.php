<?php

namespace App\Jobs;

use App\Models\Snippet;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use ZipArchive;

class GenerateSnippetZip implements ShouldQueue
{
    use Queueable;

    public int $timeout = 60;

    public function __construct(
        public readonly int $snippetId,
        public readonly array $fileIds,
        public readonly string $outputPath,
    ) {}

    public function handle(): void
    {
        $snippet = Snippet::with('files')->findOrFail($this->snippetId);
        $files = $this->fileIds !== []
            ? $snippet->files->whereIn('id', $this->fileIds)
            : $snippet->files;

        $zip = new ZipArchive;
        $zip->open($this->outputPath, ZipArchive::OVERWRITE);
        foreach ($files as $file) {
            $zip->addFromString($file->path, $file->content);
        }
        $zip->close();
    }
}
