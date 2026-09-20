<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class RestoreDatabase extends Command
{
    protected $signature = 'portfolio:restore-database
        {file? : Path to a backup file, or a filename inside storage/app/backups. Defaults to the most recent backup.}
        {--list : List available backups and exit}
        {--force : Skip the confirmation prompt}';

    protected $description = 'Restore the SQLite database from a snapshot taken by portfolio:backup-database';

    public function handle(): int
    {
        if (config('database.default') !== 'sqlite') {
            $this->error('This command only supports the sqlite connection.');

            return self::FAILURE;
        }

        $backupDir = storage_path('app/backups');
        $backups = collect(File::glob($backupDir.'/database-*.sqlite'))
            ->sortByDesc(fn (string $path) => filemtime($path))
            ->values();

        if ($this->option('list')) {
            if ($backups->isEmpty()) {
                $this->info('No backups found in '.$backupDir);

                return self::SUCCESS;
            }

            foreach ($backups as $path) {
                $this->line(basename($path).' — '.date('Y-m-d H:i:s', filemtime($path)));
            }

            return self::SUCCESS;
        }

        $source = $this->resolveSource($backups);

        if (! $source) {
            $this->error('No backup found. Run portfolio:backup-database first, or pass --list to see what exists.');

            return self::FAILURE;
        }

        if (! File::exists($source)) {
            $this->error("Backup file not found: {$source}");

            return self::FAILURE;
        }

        $target = config('database.connections.sqlite.database');

        $this->warn("This will overwrite the current database ({$target}) with:");
        $this->line($source);

        if (! $this->option('force') && ! $this->confirm('Continue?')) {
            $this->info('Aborted.');

            return self::SUCCESS;
        }

        // Snapshot whatever is live right now before overwriting it, so an
        // accidental restore is itself recoverable.
        if (File::exists($target)) {
            $this->call('portfolio:backup-database', ['--keep' => 10]);
        }

        File::copy($source, $target);
        $this->info('Database restored from '.basename($source).'.');

        return self::SUCCESS;
    }

    private function resolveSource($backups): ?string
    {
        $file = $this->argument('file');

        if (! $file) {
            return $backups->first();
        }

        if (File::exists($file)) {
            return $file;
        }

        $candidate = storage_path('app/backups/'.$file);

        return File::exists($candidate) ? $candidate : null;
    }
}
