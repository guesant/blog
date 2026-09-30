<?php

namespace App\Filament\Resources\SidebarGroups\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class SidebarGroupForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Sidebar group settings'))
                    ->columns(2)
                    ->schema([
                        TextInput::make('key')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->alphaDash()
                            ->maxLength(100),
                        Toggle::make('active')
                            ->default(true),
                    ]),
                Tabs::make('translations')
                    ->tabs([
                        Tab::make(__('English'))
                            ->schema([
                                Section::make(__('Content'))
                                    ->schema([
                                        TextInput::make('translations.en.label')
                                            ->label('Label')
                                            ->required()
                                            ->maxLength(255),
                                    ])
                                    ->columnSpanFull(),
                            ]),
                        Tab::make(__('Português'))
                            ->schema([
                                Section::make(__('Content'))
                                    ->schema([
                                        TextInput::make('translations.pt-BR.label')
                                            ->label('Label')
                                            ->required()
                                            ->maxLength(255),
                                    ])
                                    ->columnSpanFull(),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
