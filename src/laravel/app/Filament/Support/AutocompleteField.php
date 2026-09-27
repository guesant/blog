<?php

namespace App\Filament\Support;

use Closure;
use Filament\Forms\Components\TextInput;

final class AutocompleteField
{
    public static function make(
        string $name,
        string $label,
        array|Closure $suggestions,
        bool $required = false,
    ): TextInput {
        return TextInput::make($name)
            ->label($label)
            ->datalist(function () use ($suggestions): array {
                $values = is_array($suggestions) ? $suggestions : $suggestions();

                return collect($values)
                    ->filter(fn ($value): bool => is_scalar($value) && filled((string) $value))
                    ->map(fn ($value): string => (string) $value)
                    ->unique()
                    ->sort()
                    ->values()
                    ->all();
            })
            ->required($required)
            ->nullable(! $required);
    }
}
