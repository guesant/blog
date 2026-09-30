<?php

namespace App\Filament\Resources\Technologies\Schemas;

use App\Filament\Concerns\BuildsTranslationTabs;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TechnologyForm
{
    use BuildsTranslationTabs;

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Technology settings'))
                    ->columns(2)
                    ->schema([
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->maxLength(255),
                        TextInput::make('code')
                            ->maxLength(255)
                            ->helperText(__('Optional short code, e.g. a version label.')),
                        TextInput::make('logo')
                            ->maxLength(255)
                            ->helperText(__('Simple Icons slug, e.g. "react" or "githubactions".')),
                        Toggle::make('hidden')
                            ->label(__('Hide from public site'))
                            ->default(false),
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
