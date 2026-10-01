<?php

namespace App\Filament\Concerns;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;

trait BuildsStructuredFields
{
    protected static function metricsRepeater(string $prefix): Repeater
    {
        return Repeater::make("{$prefix}metrics")
            ->label('Metrics')
            ->columns(2)
            ->schema([
                TextInput::make('value')
                    ->required()
                    ->helperText(__('The headline number, e.g. "40%" or "1200".')),
                TextInput::make('label')
                    ->required()
                    ->helperText(__('What the number means, e.g. "waitlist reduction".')),
            ])
            ->itemLabel(fn (mixed $state): ?string => is_array($state)
                ? trim(($state['value'] ?? '').' '.($state['label'] ?? '')) ?: null
                : null)
            ->formatStateUsing(fn (mixed $state): array => is_array($state) ? $state : [])
            ->addActionLabel(__('Add metric'))
            ->defaultItems(0);
    }

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
