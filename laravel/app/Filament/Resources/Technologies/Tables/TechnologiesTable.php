<?php

namespace App\Filament\Resources\Technologies\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TechnologiesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                TextColumn::make('name_en')
                    ->label('Name (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->name),
                TextColumn::make('logo')->label('Icon slug'),
                TextColumn::make('order')->sortable(),
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
