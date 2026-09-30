<?php

namespace App\Console\Commands;

use App\Models\MediaAsset;
use App\Support\MediaAssetReferenceScanner;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class GarbageCollectMediaAssets extends Command
{
    protected $signature = 'media:gc {--grace=7} {--limit=1000} {--dry-run}';

    protected $description = 'Remove unreferenced media assets after a grace period';

    public function handle(MediaAssetReferenceScanner $references): int
    {
        $grace = (int) $this->option('grace');

        if ($grace < 0) {
            $this->error('Grace period must be zero or greater.');

            return self::INVALID;
        }

        $limit = (int) $this->option('limit');

        if ($limit < 1) {
            $this->error('Limit must be greater than zero.');

            return self::INVALID;
        }

        $cutoff = now()->subDays($grace);
        $candidates = MediaAsset::query()
            ->where('created_at', '<', $cutoff)
            ->oldest('created_at')
            ->limit($limit)
            ->get();
        $removed = 0;

        foreach ($candidates as $asset) {
            if ($references->isReferenced($asset)) {
                if (! $this->option('dry-run')) {
                    $asset->update(['last_referenced_at' => now()]);
                }

                continue;
            }

            $removed++;
            $this->line("{$asset->disk}: {$asset->path}");

            if ($this->option('dry-run')) {
                continue;
            }

            Storage::disk($asset->disk)->delete($asset->path);
            $asset->delete();
        }

        $this->info(($this->option('dry-run') ? 'Would remove ' : 'Removed ')."{$removed} media assets.");

        return self::SUCCESS;
    }
}
