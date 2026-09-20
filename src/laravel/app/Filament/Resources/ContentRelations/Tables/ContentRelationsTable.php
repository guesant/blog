<?php

namespace App\Filament\Resources\ContentRelations\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ContentRelationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->with(['subject', 'object', 'relationType']))
            ->defaultSort('id', 'desc')
            ->columns([
                TextColumn::make('relationType.key')
                    ->label('Relation type')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('subject_type')
                    ->label('Subject')
                    ->getStateUsing(fn ($record) => $record->subject_type.':'.($record->subject->slug ?? $record->subject_id)),
                TextColumn::make('object_type')
                    ->label('Object')
                    ->getStateUsing(fn ($record) => $record->object_type.':'.($record->object->slug ?? $record->object_id)),
                TextColumn::make('status')
                    ->sortable(),
                TextColumn::make('visibility')
                    ->sortable(),
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
