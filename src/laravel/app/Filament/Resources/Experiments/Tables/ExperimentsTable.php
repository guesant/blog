<?php

namespace App\Filament\Resources\Experiments\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ExperimentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                IconColumn::make('hidden')->boolean()->sortable(),
                TextColumn::make('order')->sortable(),
                TextColumn::make('name_en')
                    ->label('Name (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->name),
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
