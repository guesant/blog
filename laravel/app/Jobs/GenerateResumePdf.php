<?php

namespace App\Jobs;

use App\Support\ResumePdf\DocumentRenderer;
use App\Support\ResumePdf\ResumePdfBuilder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;

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

        $publicDir = storage_path('app/public');
        File::ensureDirectoryExists($publicDir);

        $generatedPdf = "{$workDir}/resume-{$this->locale}.pdf";
        File::copy($generatedPdf, "{$publicDir}/resume-{$this->locale}.pdf");
        File::copy($texPath, "{$publicDir}/resume-{$this->locale}.tex");
    }
}
