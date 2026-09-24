<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\MarkdownEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    use BuildsStructuredFields, BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Publishing')
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->default(false),
                        TextInput::make('href')
                            ->nullable()
                            ->url(),
                        Toggle::make('external')
                            ->default(false),
                        Toggle::make('nda')
                            ->default(false),
                        DatePicker::make('published_at')
                            ->label('Published'),
                        Toggle::make('show_history')
                            ->default(false),
                    ]),
                Section::make('Technologies')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('technologies')
                            ->relationship('technologies', 'slug')
                            ->multiple()
                            ->searchable()
                            ->preload(),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}name")
                        ->label('Name')
                        ->required()
                        ->maxLength(255),
                    Textarea::make("{$prefix}purpose")
                        ->label('Purpose')
                        ->required(),
                    Textarea::make("{$prefix}problem")
                        ->label('Problem')
                        ->nullable(),
                    Textarea::make("{$prefix}current_focus")
                        ->label('Current Focus')
                        ->nullable(),
                    TextInput::make("{$prefix}status")
                        ->label('Status')
                        ->nullable()
                        ->maxLength(255),
                    static::metricsRepeater($prefix),
                    MarkdownEditor::make("{$prefix}body")
                        ->label('Body')
                        ->nullable(),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }
}
