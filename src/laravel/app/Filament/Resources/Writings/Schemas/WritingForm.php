<?php

namespace App\Filament\Resources\Writings\Schemas;

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

class WritingForm
{
    use BuildsStructuredFields, BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->default(false),
                        Toggle::make('show_history')
                            ->label('Show version history')
                            ->default(false),
                        DatePicker::make('date_iso')
                            ->label('Date')
                            ->required(),
                        Select::make('type')
                            ->label('Type')
                            ->options([
                                'article' => 'article',
                                'note' => 'note',
                                'project-diary' => 'project-diary',
                            ])
                            ->required(),
                    ]),
                Section::make('Topics')
                    ->columnSpanFull()
                    ->schema([
                        Select::make('topics')
                            ->relationship('topics', 'slug')
                            ->multiple()
                            ->searchable()
                            ->preload(),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}title")
                        ->label('Title')
                        ->required()
                        ->maxLength(255),
                    Textarea::make("{$prefix}excerpt")
                        ->label('Excerpt')
                        ->required(),
                    TextInput::make("{$prefix}reading_time")
                        ->label('Reading Time')
                        ->nullable()
                        ->maxLength(255),
                    MarkdownEditor::make("{$prefix}body")
                        ->label('Body')
                        ->nullable(),
                    static::seoFieldset($prefix),
                ]),
            ]);
    }
}
