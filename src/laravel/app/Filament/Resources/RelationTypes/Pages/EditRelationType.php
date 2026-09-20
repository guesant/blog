<?php

namespace App\Filament\Resources\RelationTypes\Pages;

use App\Filament\Resources\RelationTypes\RelationTypeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRelationType extends EditRecord
{
    protected static string $resource = RelationTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
