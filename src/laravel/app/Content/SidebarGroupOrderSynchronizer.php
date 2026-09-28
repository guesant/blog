<?php

namespace App\Content;

use App\Events\PublicSiteContentChanged;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class SidebarGroupOrderSynchronizer
{
    public function synchronize(array $orderedGroupKeys): void
    {
        $items = DB::table('nav_items')
            ->select(['id', 'current_revision_id', 'published_revision_id', 'sidebar_group'])
            ->where('placement', 'sidebar')
            ->whereNull('parent_id')
            ->whereNotNull('sidebar_group')
            ->get();

        $existingGroupKeys = $items
            ->pluck('sidebar_group')
            ->map(static fn (mixed $key): int => (int) $key)
            ->unique()
            ->sort()
            ->values();

        $groupKeys = collect($orderedGroupKeys)
            ->map(static fn (mixed $key): int => (int) $key)
            ->values();

        if ($groupKeys->count() !== $existingGroupKeys->count() || $groupKeys->sort()->values()->all() !== $existingGroupKeys->all()) {
            throw new InvalidArgumentException('The submitted sidebar groups do not match the current navigation.');
        }

        if ($groupKeys->all() === $existingGroupKeys->all()) {
            return;
        }

        $positions = $groupKeys->mapWithKeys(
            static fn (int $key, int $position): array => [(string) $key => $position],
        );
        $offset = ($existingGroupKeys->max() ?? 0) + $existingGroupKeys->count() + 1;

        DB::transaction(function () use ($items, $positions, $offset): void {
            $itemIds = $items->pluck('id')->all();

            DB::table('nav_items')
                ->whereIn('id', $itemIds)
                ->update(['sidebar_group' => DB::raw('sidebar_group + '.$offset)]);

            foreach ($items as $item) {
                $position = $positions->get((string) $item->sidebar_group);

                if ($position === null) {
                    continue;
                }

                DB::table('nav_items')
                    ->where('id', $item->id)
                    ->update(['sidebar_group' => $position]);

                $revisionIds = collect([$item->current_revision_id, $item->published_revision_id])
                    ->filter()
                    ->unique()
                    ->values();

                if ($revisionIds->isNotEmpty()) {
                    DB::table('nav_item_revisions')
                        ->whereIn('id', $revisionIds)
                        ->update(['sidebar_group' => $position]);
                }
            }
        });

        PublicSiteContentChanged::dispatch();
    }
}
