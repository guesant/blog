<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class BackupDatabase extends Command
{
    protected $signature = 'portfolio:backup-database {--keep=10 : How many recent backups to retain, oldest are pruned}';

    protected $description = 'Take a consistent snapshot of the SQLite database into storage/app/backups';

    public function handle(): int
    {
        if (config('database.default') !== 'sqlite') {
            $this->error('This command only supports the sqlite connection.');

            return self::FAILURE;
        }

        $source = config('database.connections.sqlite.database');

        if (! File::exists($source)) {
            $this->error("Database file not found: {$source}");

            return self::FAILURE;
        }

        $backupDir = storage_path('app/backups');
        File::ensureDirectoryExists($backupDir);

        $destination = $backupDir.'/database-'.now()->format('Y-m-d_His').'.sqlite';

        // VACUUM INTO produces an atomic, consistent copy (safe even against
        // concurrent writers under WAL mode) — a plain file copy can't
        // guarantee that.
        DB::statement('VACUUM INTO ?', [$destination]);

        $this->info('Backup written: '.$destination.' ('.$this->humanSize(filesize($destination)).')');

        $this->prune($backupDir, (int) $this->option('keep'));

        return self::SUCCESS;
    }

    private function prune(string $backupDir, int $keep): void
    {
        $backups = collect(File::glob($backupDir.'/database-*.sqlite'))
            ->sortByDesc(fn (string $path) => filemtime($path))
            ->values();

        foreach ($backups->slice($keep) as $stale) {
            File::delete($stale);
            $this->line('Pruned old backup: '.basename($stale));
        }
    }

    private function humanSize(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $size = $bytes;
        $unit = 0;

        while ($size >= 1024 && $unit < count($units) - 1) {
            $size /= 1024;
            $unit++;
        }

        return round($size, 1).' '.$units[$unit];
    }
}
