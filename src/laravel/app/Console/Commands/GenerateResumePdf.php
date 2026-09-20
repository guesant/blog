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
            $this->info("Generating résumé PDF for locale: {$locale}");
            GenerateResumePdfJob::dispatchSync($locale);
            $this->info("Done: storage/app/public/resume-{$locale}.pdf");
        }

        return self::SUCCESS;
    }
}
