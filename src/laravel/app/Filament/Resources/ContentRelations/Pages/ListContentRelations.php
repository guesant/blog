<?php

namespace App\Filament\Resources\ContentRelations\Pages;

use App\Filament\Resources\ContentRelations\ContentRelationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListContentRelations extends ListRecords
{
    protected static string $resource = ContentRelationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
