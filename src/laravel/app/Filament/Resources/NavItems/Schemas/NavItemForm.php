<?php

namespace App\Filament\Resources\NavItems\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Route;

class NavItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->columns(2)
                    ->schema([
                        Select::make('route_name')
                            ->required()
                            ->searchable()
                            ->options(self::routeNameOptions()),
                        Select::make('parent_id')
                            ->label('Parent nav item')
                            ->relationship('parent', 'route_name')
                            ->nullable(),
                        Select::make('placement')
                            ->options([
                                'sidebar' => 'sidebar',
                                'footer_links' => 'footer_links',
                            ])
                            ->nullable(),
                        TextInput::make('sidebar_group')
                            ->numeric()
                            ->nullable(),
                        TextInput::make('order')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ]),
            ]);
    }

    private static function routeNameOptions(): array
    {
        return collect(Route::getRoutes())
            ->pluck('action.as')
            ->filter()
            ->reject(fn (string $name) => str_ends_with($name, '.pt-BR'))
            ->unique()
            ->sort()
            ->mapWithKeys(fn (string $name) => [$name => $name])
            ->all();
    }
}
