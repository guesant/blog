<?php

namespace App\Filament\Resources\Writings\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Writings\WritingResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Writing getRecord()
 */
class CreateWriting extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = WritingResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
