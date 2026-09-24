<?php

namespace App\Filament\Resources\CaseStudies\Tables;

use App\Filament\Concerns\ConfiguresRecordOrdering;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CaseStudiesTable
{
    use ConfiguresRecordOrdering;

    public static function configure(Table $table): Table
    {
        return static::configureRecordOrdering($table
            ->defaultSort('order')
            ->columns([
                TextColumn::make('slug')->searchable()->sortable(),
                IconColumn::make('hidden')->boolean()->sortable(),
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
            ]));
    }
}
