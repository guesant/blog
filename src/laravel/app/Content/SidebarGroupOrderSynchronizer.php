<?php

namespace App\Content;

use App\Events\PublicSiteContentChanged;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

final class SidebarGroupOrderSynchronizer
{
    public function synchronize(array $orderedGroupKeys): void
    {
        $existingGroupKeys = DB::table('sidebar_groups')
            ->pluck('id')
            ->map(static fn (mixed $key): int => (int) $key)
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
            static fn (int $key, int $position): array => [(string) $key => $position + 1],
        );

        DB::transaction(function () use ($positions): void {
            foreach ($positions as $groupId => $position) {
                DB::table('sidebar_groups')
                    ->where('id', (int) $groupId)
                    ->update(['order' => $position]);
            }
        });

        PublicSiteContentChanged::dispatch();
    }
}
