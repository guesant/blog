<?php

namespace App\Support;

class ViewMode
{
    public const DEFAULT = 'spacious';

    public static function paramFor(string $denseTarget): string
    {
        $prefix = 'view-dense-';

        if (! str_starts_with($denseTarget, $prefix)) {
            return 'view';
        }

        $suffix = substr($denseTarget, strlen($prefix));

        return 'view_'.str_replace('-', '_', $suffix);
    }

    public static function current(string $denseTarget): string
    {
        $value = request()->query(self::paramFor($denseTarget), self::DEFAULT);

        return $value === 'dense' ? 'dense' : self::DEFAULT;
    }
}
