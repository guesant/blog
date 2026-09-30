<?php

namespace App\Support;

use App\Models\MediaAsset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

final class MediaAssetReferenceScanner
{
    public function isReferenced(MediaAsset $asset): bool
    {
        foreach (Schema::getTableListing(null, false) as $table) {
            if ($table === 'media_assets') {
                continue;
            }

            foreach (Schema::getColumns($table) as $column) {
                if (! $this->isSearchableType($column['type_name'] ?? $column['type'] ?? '')) {
                    continue;
                }

                $query = DB::table($table);
                $wrappedColumn = $query->getQuery()->getGrammar()->wrap($column['name']);

                if ($query->whereRaw(
                    "CAST({$wrappedColumn} AS TEXT) LIKE ?",
                    ["%{$asset->path}%"],
                )->exists()) {
                    return true;
                }
            }
        }

        return false;
    }

    private function isSearchableType(string $type): bool
    {
        return in_array(strtolower($type), [
            'character varying',
            'json',
            'jsonb',
            'text',
            'varchar',
        ], true);
    }
}
