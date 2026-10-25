<?php

namespace App\Content;

use Illuminate\Database\Eloquent\Builder;

final class PublicIdentifier
{
    public static function constrain(
        Builder $query,
        string $identifier,
        string $publicIdColumn = 'public_id',
        string $slugColumn = 'slug',
    ): Builder {
        $publicId = self::value($identifier);

        return $query->where($publicId === null ? $slugColumn : $publicIdColumn, $publicId ?? $identifier);
    }

    private static function value(string $identifier): ?string
    {
        [$publicId, $slug] = array_pad(explode('-', $identifier, 2), 2, null);

        return $slug !== null && preg_match('/^[a-f0-9]{6}$/i', $publicId) === 1
            ? $publicId
            : null;
    }
}
