<?php

namespace App\Filament\Resources\CreditEntries\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\CreditCategory;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CreditEntryForm
{
    use BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Credit metadata')
                    ->columns(2)
                    ->schema([
                        TextInput::make('url')
                            ->nullable()
                            ->url()
                            ->maxLength(255),
                        Select::make('category')
                            ->required()
                            ->options(fn (): array => CreditCategory::query()
                                ->orderBy('order')
                                ->orderBy('slug')
                                ->pluck('slug', 'slug')
                                ->all()),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}name")
                        ->label('Name')
                        ->required()
                        ->maxLength(255),
                    Textarea::make("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                ]),
            ]);
    }
}
