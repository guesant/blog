<?php

namespace App\Filament\Resources\Pages\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('slug')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                IconColumn::make('hidden')
                    ->label(__('Hidden'))
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
