<?php

namespace App\Filament\Concerns;

use App\Content\EditorialOrderSynchronizer;
use Filament\Actions\Action;
use Filament\Tables\Table;

trait ConfiguresRecordOrdering
{
    protected static function configureRecordOrdering(Table $table): Table
    {
        $modelClass = $table->getModel();

        if ($modelClass === null) {
            return $table;
        }

        $modelTable = app($modelClass)->getTable();

        return $table
            ->reorderable('order')
            ->reorderRecordsTriggerAction(
                fn (Action $action): Action => $action
                    ->label('Edit order')
                    ->button(),
            )
            ->afterReordering(
                function (array $order) use ($modelTable): void {
                    app(EditorialOrderSynchronizer::class)->synchronize($modelTable, $order);
                },
            );
    }
}
