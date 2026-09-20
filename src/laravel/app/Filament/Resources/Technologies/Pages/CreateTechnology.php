<?php

namespace App\Filament\Resources\Technologies\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Technologies\TechnologyResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Technology getRecord()
 */
class CreateTechnology extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = TechnologyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
