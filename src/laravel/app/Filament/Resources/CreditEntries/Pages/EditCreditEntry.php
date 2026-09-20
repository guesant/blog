<?php

namespace App\Filament\Resources\CreditEntries\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\CreditEntries\CreditEntryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\CreditEntry getRecord()
 */
class EditCreditEntry extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = CreditEntryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->fillTranslationsIntoData($data);
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
