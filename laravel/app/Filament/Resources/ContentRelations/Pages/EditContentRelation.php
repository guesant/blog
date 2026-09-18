<?php

namespace App\Filament\Resources\ContentRelations\Pages;

use App\Filament\Resources\ContentRelations\ContentRelationResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditContentRelation extends EditRecord
{
    protected static string $resource = ContentRelationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
