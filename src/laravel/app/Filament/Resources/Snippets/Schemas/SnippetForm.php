<?php

namespace App\Filament\Resources\Snippets\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SnippetForm
{
    use BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Snippet settings')
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        Toggle::make('hidden')
                            ->default(false),
                        Toggle::make('show_history')
                            ->helperText('Show a public version-history/diff section on this snippet\'s page.')
                            ->default(false),
                        DatePicker::make('published_at')
                            ->label('Published'),
                    ]),
                Section::make('Files')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('files')
                            ->relationship('files')
                            ->orderColumn('order')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                TextInput::make('path')
                                    ->label('Path')
                                    ->placeholder('src/components/Example.tsx')
                                    ->required()
                                    ->columnSpanFull(),
                                TextInput::make('language')
                                    ->label('Language')
                                    ->placeholder('typescript')
                                    ->nullable(),
                                Textarea::make('content')
                                    ->label('Content')
                                    ->required()
                                    ->rows(14)
                                    ->extraInputAttributes(['style' => 'font-family: ui-monospace, monospace; font-size: 0.8125rem;'])
                                    ->columnSpanFull(),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['path'] ?? null)
                            ->addActionLabel('Add file')
                            ->defaultItems(1),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}title")
                        ->label('Title')
                        ->required()
                        ->maxLength(255),
                    Textarea::make("{$prefix}description")
                        ->label('Description')
                        ->nullable(),
                ]),
            ]);
    }
}
