<?php

namespace App\Filament\Resources\ResourceFindings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ResourceFindingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                IconColumn::make('hidden')->boolean()->sortable(),
                TextColumn::make('type')->sortable(),
                TextColumn::make('visibility')->sortable(),
                TextColumn::make('title_en')
                    ->label('Title (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->title),
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
