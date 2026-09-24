<?php

namespace App\Filament\Resources\Technologies\Tables;

use App\Filament\Concerns\ConfiguresRecordOrdering;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TechnologiesTable
{
    use ConfiguresRecordOrdering;

    public static function configure(Table $table): Table
    {
        return static::configureRecordOrdering($table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                TextColumn::make('name_en')
                    ->label('Name (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->name),
                TextColumn::make('logo')->label('Icon slug'),
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
            ]));
    }
}
