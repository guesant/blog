<?php

namespace App\Filament\Resources\CreditEntries\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\CreditEntries\CreditEntryResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\CreditEntry getRecord()
 */
class CreateCreditEntry extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = CreditEntryResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
