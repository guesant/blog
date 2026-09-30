<?php

namespace App\Console\Commands;

use App\Jobs\GenerateResumePdf as GenerateResumePdfJob;
use Illuminate\Console\Command;

class GenerateResumePdf extends Command
{
    protected $signature = 'portfolio:generate-resume-pdf {--locale=}';

    protected $description = 'Generate the résumé PDF (both locales, or one via --locale)';

    public function handle(): int
    {
        $locales = $this->option('locale') ? [$this->option('locale')] : ['en', 'pt-BR'];

        foreach ($locales as $locale) {
            GenerateResumePdfJob::dispatch($locale);
            $this->info("Queued résumé PDF generation for locale: {$locale}");
        }

        return self::SUCCESS;
    }
}
