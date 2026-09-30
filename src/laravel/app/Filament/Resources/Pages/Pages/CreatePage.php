<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Pages\PageResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Page getRecord()
 */
class CreatePage extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = PageResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
