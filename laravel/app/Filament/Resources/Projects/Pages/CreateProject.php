<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Projects\ProjectResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Project getRecord()
 */
class CreateProject extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = ProjectResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
