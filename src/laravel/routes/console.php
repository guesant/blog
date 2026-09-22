<?php

use App\Jobs\WarmKnowledgeGraph;
use App\Jobs\WarmOpenGraphMetadata;
use App\Jobs\WarmPublicSiteChrome;
use App\Jobs\WarmResourceFacetCache;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('content:sync-dependency-credits')->weekly();
Schedule::job(new WarmResourceFacetCache)->everyFiveMinutes()->withoutOverlapping();
Schedule::job(new WarmKnowledgeGraph)->everyFifteenMinutes()->withoutOverlapping();
Schedule::job(new WarmOpenGraphMetadata)->everyFifteenMinutes()->withoutOverlapping();
Schedule::job(new WarmPublicSiteChrome('en'))
    ->name('warm-public-site-chrome-en')
    ->everyFiveMinutes()
    ->withoutOverlapping();
Schedule::job(new WarmPublicSiteChrome('pt-BR'))
    ->name('warm-public-site-chrome-pt-BR')
    ->everyFiveMinutes()
    ->withoutOverlapping();
