<?php

namespace App\Filament\Resources\ReferenceCollections\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\ReferenceCollections\ReferenceCollectionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\ReferenceCollection getRecord()
 */
class EditReferenceCollection extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = ReferenceCollectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data = $this->fillTranslationsIntoData($data);

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterSave(): void
    {
        $this->persistTranslations();
    }
}
