<?php

namespace App\Jobs;

use App\Support\ResumePdf\DocumentRenderer;
use App\Support\ResumePdf\ResumePdfBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class GenerateResumePdf implements ShouldQueue
{
    use Queueable;

    public int $timeout = 180;

    public function __construct(public readonly string $locale) {}

    public function handle(ResumePdfBuilder $builder, DocumentRenderer $renderer): void
    {
        $texSource = $builder->buildTexSource($this->locale);

        $workDir = storage_path("app/resume-pdf/{$this->locale}");
        File::ensureDirectoryExists($workDir);

        $texPath = "{$workDir}/resume-{$this->locale}.tex";
        File::put($texPath, $texSource);

        $renderer->renderTexToPdf($texPath, $workDir);

        $generatedPdf = "{$workDir}/resume-{$this->locale}.pdf";
        $disk = Storage::disk((string) config('filesystems.default'));
        if (! $disk->put("resume/resume-{$this->locale}.pdf", File::get($generatedPdf))) {
            throw new \RuntimeException('The generated resume PDF could not be stored.');
        }

        if (! $disk->put("resume/resume-{$this->locale}.tex", File::get($texPath))) {
            throw new \RuntimeException('The generated resume source could not be stored.');
        }
    }
}
