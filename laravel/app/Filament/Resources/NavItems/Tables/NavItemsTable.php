<?php

namespace App\Filament\Resources\NavItems\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class NavItemsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('route_name')->searchable()->sortable(),
                TextColumn::make('parent.route_name')->label('Parent')->sortable(),
                TextColumn::make('placement')->sortable(),
                TextColumn::make('sidebar_group')->sortable(),
                TextColumn::make('order')->sortable(),
                TextColumn::make('label_en')
                    ->label('Label (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->label),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
