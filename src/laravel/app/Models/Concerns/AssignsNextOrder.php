<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Model;

trait AssignsNextOrder
{
    protected static function bootAssignsNextOrder(): void
    {
        static::creating(function (Model $model): void {
            if ($model->getAttribute('order') !== null) {
                return;
            }

            $model->setAttribute('order', ((int) static::query()->max('order')) + 1);
        });
    }
}
