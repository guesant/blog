<?php

namespace App\Filament\Resources\CreditEntries\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CreditEntriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('category')->sortable(),
                TextColumn::make('order')->sortable(),
                TextColumn::make('name_en')
                    ->label('Name (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->name),
                TextColumn::make('url')->limit(40),
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
