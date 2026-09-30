<?php

namespace App\Filament\Resources\MediaAssets\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MediaAssetsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('path')->searchable()->sortable()->wrap(),
                TextColumn::make('disk')->searchable()->sortable(),
                TextColumn::make('mime_type')->searchable(),
                TextColumn::make('visibility')->badge()->sortable(),
                TextColumn::make('size')->numeric()->sortable(),
                TextColumn::make('last_referenced_at')->dateTime()->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
