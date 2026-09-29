<?php

namespace App\Filament\Resources\CreditEntries\Schemas;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Models\CreditCategory;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CreditEntryForm
{
    use BuildsMarkdownEditors, BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Credit metadata'))
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
                        Toggle::make('active')
                            ->default(true),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}name")
                        ->label('Name')
                        ->required()
                        ->maxLength(255),
                    static::markdownEditor("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                ]),
            ]);
    }
}
