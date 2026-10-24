<?php

namespace App\Filament\Resources\ReferenceCollections\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\ReferenceCollections\ReferenceCollectionResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\ReferenceCollection getRecord()
 */
class CreateReferenceCollection extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = ReferenceCollectionResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
