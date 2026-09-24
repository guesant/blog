<?php

namespace App\Filament\Resources\Topics\Tables;

use App\Filament\Concerns\ConfiguresRecordOrdering;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TopicsTable
{
    use ConfiguresRecordOrdering;

    public static function configure(Table $table): Table
    {
        return static::configureRecordOrdering($table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                TextColumn::make('kind')->sortable(),
                TextColumn::make('parent.slug')
                    ->label('Parent')
                    ->sortable(),
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
            ]));
    }
}
