<?php

namespace App\Filament\Resources\SidebarGroups\Tables;

use App\Content\SidebarGroupOrderSynchronizer;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SidebarGroupsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('order')
            ->reorderable('order')
            ->reorderRecordsTriggerAction(
                fn (Action $action): Action => $action
                    ->label(__('Edit order'))
                    ->button(),
            )
            ->afterReordering(
                function (array $order): void {
                    app(SidebarGroupOrderSynchronizer::class)->synchronize($order);
                },
            )
            ->columns([
                TextColumn::make('key')->searchable()->sortable(),
                TextColumn::make('name_en')
                    ->label('Name (EN)')
                    ->getStateUsing(fn ($record) => $record->translation('en')?->label),
                TextColumn::make('name_pt_br')
                    ->label('Name (PT-BR)')
                    ->getStateUsing(fn ($record) => $record->translation('pt-BR')?->label),
                IconColumn::make('active')->boolean()->sortable(),
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
