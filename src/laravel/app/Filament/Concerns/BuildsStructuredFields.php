<?php

namespace App\Filament\Concerns;

use Filament\Forms\Components\Repeater;

trait BuildsStructuredFields
{
    protected static function stringListRepeater(string $name, string $label, string $addLabel): Repeater
    {
        return Repeater::make($name)
            ->label($label)
            ->simple(static::markdownEditor('value')->required())
            ->default([])
            ->addActionLabel($addLabel)
            ->defaultItems(0);
    }
}
