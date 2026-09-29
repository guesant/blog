<?php

namespace App\Filament\Resources\NavItems\Schemas;

use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Route;

class NavItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Navigation item'))
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
                                'sidebar' => __('sidebar'),
                                'footer_links' => __('footer_links'),
                            ])
                            ->nullable(),
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
