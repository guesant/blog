<?php

namespace App\Filament\Resources\CreditCategories\Pages;

use App\Filament\Concerns\SyncsCreditCategoryTranslations;
use App\Filament\Resources\CreditCategories\CreditCategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\CreditCategory getRecord()
 */
class EditCreditCategory extends EditRecord
{
    use SyncsCreditCategoryTranslations;

    protected static string $resource = CreditCategoryResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->fillCreditCategoryTranslationsIntoData($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->extractCreditCategoryTranslations($data);
    }

    protected function afterSave(): void
    {
        $this->persistCreditCategoryTranslations();
    }

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()];
    }
}
