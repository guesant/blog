<?php

namespace App\Filament\Resources\NavItems\Schemas;

use App\Models\SidebarGroup;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
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
                            ->live()
                            ->options([
                                'sidebar' => __('sidebar'),
                                'footer_links' => __('footer_links'),
                            ])
                            ->nullable(),
                        Select::make('sidebar_group_id')
                            ->label('Sidebar group')
                            ->options(fn (): array => SidebarGroup::query()
                                ->with('translations')
                                ->orderBy('order')
                                ->get()
                                ->mapWithKeys(function (SidebarGroup $group): array {
                                    $translation = $group->translation('en');

                                    return [$group->id => $translation === null ? $group->key : $translation->label];
                                })
                                ->all())
                            ->searchable()
                            ->nullable()
                            ->required(fn (Get $get): bool => $get('placement') === 'sidebar')
                            ->visible(fn (Get $get): bool => $get('placement') === 'sidebar'),
                        Toggle::make('hidden')
                            ->label(__('Hide from navigation'))
                            ->default(false),
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
