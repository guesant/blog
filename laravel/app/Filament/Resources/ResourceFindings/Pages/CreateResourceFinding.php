<?php

namespace App\Filament\Resources\ResourceFindings\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\ResourceFindings\ResourceFindingResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Resource getRecord()
 */
class CreateResourceFinding extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = ResourceFindingResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
