<?php

namespace App\Filament\Resources\Topics\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TopicForm
{
    use BuildsTranslationTabs;

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
                        TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->required(),
                        Select::make('kind')
                            ->required()
                            ->default('topic')
                            ->options([
                                'topic' => 'topic',
                                'category' => 'category',
                                'skill' => 'skill',
                            ]),
                        Select::make('parent_id')
                            ->label('Parent Topic')
                            ->relationship('parent', 'slug')
                            ->nullable(),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    TextInput::make("{$prefix}name")
                        ->label('Name')
                        ->required()
                        ->maxLength(255),
                ]),
            ]);
    }
}
