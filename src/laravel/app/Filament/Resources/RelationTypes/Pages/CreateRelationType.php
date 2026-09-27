<?php

namespace App\Filament\Resources\RelationTypes\Pages;

use App\Filament\Concerns\SyncsRelationTypeTranslations;
use App\Filament\Resources\RelationTypes\RelationTypeResource;
use Filament\Resources\Pages\CreateRecord;

class CreateRelationType extends CreateRecord
{
    use SyncsRelationTypeTranslations;

    protected static string $resource = RelationTypeResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractRelationTypeTranslations($data);
    }

    protected function afterCreate(): void
    {
        $this->persistRelationTypeTranslations();
    }
}
