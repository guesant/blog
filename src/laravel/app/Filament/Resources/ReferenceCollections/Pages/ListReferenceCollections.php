<?php

namespace App\Filament\Resources\ReferenceCollections\Pages;

use App\Filament\Resources\ReferenceCollections\ReferenceCollectionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListReferenceCollections extends ListRecords
{
    protected static string $resource = ReferenceCollectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
