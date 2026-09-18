<?php

namespace App\Support\ResumePdf;

use RuntimeException;
use Symfony\Component\Process\Process;

class DocumentRenderer
{
    public function renderTexToPdf(string $texPath, string $outputDir): void
    {
        $bundle = env('TECTONIC_BUNDLE');

        if (! $bundle) {
            throw new RuntimeException('TECTONIC_BUNDLE must be set to the pinned Tectonic bundle URL.');
        }

        $process = new Process([
            'tectonic',
            '--bundle', $bundle,
            '--outdir', $outputDir,
            $texPath,
        ]);

        $process->setTimeout(120);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new RuntimeException("Tectonic failed to compile {$texPath}: ".$process->getErrorOutput());
        }
    }
}
