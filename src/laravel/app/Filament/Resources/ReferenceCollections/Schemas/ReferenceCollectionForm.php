<?php

namespace App\Filament\Resources\ReferenceCollections\Schemas;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReferenceCollectionForm
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Publishing'))
                    ->columnSpanFull()
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->default(false),
                        TextInput::make('image')
                            ->nullable()
                            ->maxLength(255),
                        DatePicker::make('published_at')
                            ->label('Published'),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}title")
                        ->label('Title')
                        ->required()
                        ->maxLength(255),
                    static::markdownEditor("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                    static::markdownEditor("{$prefix}intro")
                        ->label('Intro')
                        ->nullable(),
                ]),
            ]);
    }
}
