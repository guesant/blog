<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Pages\PageResource;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\Page getRecord()
 */
class EditPage extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = PageResource::class;

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
