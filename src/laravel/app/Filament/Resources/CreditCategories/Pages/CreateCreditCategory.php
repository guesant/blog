<?php

namespace App\Filament\Resources\CreditCategories\Pages;

use App\Filament\Concerns\SyncsCreditCategoryTranslations;
use App\Filament\Resources\CreditCategories\CreditCategoryResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\CreditCategory getRecord()
 */
class CreateCreditCategory extends CreateRecord
{
    use SyncsCreditCategoryTranslations;

    protected static string $resource = CreditCategoryResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractCreditCategoryTranslations($data);
    }

    protected function afterCreate(): void
    {
        $this->persistCreditCategoryTranslations();
    }
}
