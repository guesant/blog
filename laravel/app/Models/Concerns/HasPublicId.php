<?php

namespace App\Models\Concerns;

trait HasPublicId
{
    protected static function bootHasPublicId(): void
    {
        static::creating(function ($model): void {
            if ($model->getAttribute('public_id')) {
                return;
            }

            do {
                $publicId = bin2hex(random_bytes(3));
            } while (static::query()->where('public_id', $publicId)->exists());

            $model->setAttribute('public_id', $publicId);
        });
    }
}
