<?php

namespace App\Filament\Resources\Technologies\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TechnologyForm
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
                        TextInput::make('code')
                            ->maxLength(255)
                            ->helperText('Optional short code, e.g. a version label.'),
                        TextInput::make('logo')
                            ->maxLength(255)
                            ->helperText('Simple Icons slug, e.g. "react" or "githubactions".'),
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
