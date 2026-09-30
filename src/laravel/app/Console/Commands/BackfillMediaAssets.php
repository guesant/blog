<?php

namespace App\Console\Commands;

use App\Models\MediaAsset;
use App\Support\MediaAssetRegistrar;
use Illuminate\Console\Command;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class BackfillMediaAssets extends Command
{
    protected $signature = 'media:backfill {--disk=} {--visibility=public} {--dry-run}';

    protected $description = 'Register existing content attachments in the media catalog';

    public function handle(MediaAssetRegistrar $registrar): int
    {
        $diskNames = $this->diskNames();
        $visibility = (string) $this->option('visibility');

        if (! in_array($visibility, ['private', 'public'], true)) {
            $this->error('Visibility must be private or public.');

            return self::INVALID;
        }

        $found = 0;

        foreach ($diskNames as $diskName) {
            $disk = Storage::disk($diskName);

            foreach ($disk->allFiles('content-attachments') as $path) {
                $found++;
                $this->line("{$diskName}: {$path}");

                if ($this->option('dry-run')) {
                    continue;
                }

                $existing = MediaAsset::query()
                    ->where('disk', $diskName)
                    ->where('path', $path)
                    ->first();
                $assetVisibility = $existing === null ? $visibility : $existing->visibility;

                $registrar->register(
                    disk: $diskName,
                    path: $path,
                    originalName: basename($path),
                    mimeType: rescue(fn () => $disk->mimeType($path), null, false),
                    size: rescue(fn () => $disk->size($path), null, false),
                    checksum: $this->checksum($disk, $path),
                    visibility: $assetVisibility,
                );
            }
        }

        $this->info(($this->option('dry-run') ? 'Would register ' : 'Registered ')."{$found} media assets.");

        return self::SUCCESS;
    }

    private function diskNames(): array
    {
        $selected = $this->option('disk');

        if (is_string($selected) && $selected !== '') {
            return [$selected];
        }

        $default = (string) config('filesystems.default');
        $disks = [$default];

        if ($default === 'local') {
            $disks[] = 'public';
        }

        return array_values(array_unique($disks));
    }

    private function checksum(FilesystemAdapter $disk, string $path): ?string
    {
        $stream = $disk->readStream($path);

        if (! is_resource($stream)) {
            return null;
        }

        $context = hash_init('sha256');
        hash_update_stream($context, $stream);
        fclose($stream);

        return hash_final($context);
    }
}
