<?php

namespace App\Filament\Resources\Experiments\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Experiments\ExperimentResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Experiment getRecord()
 */
class CreateExperiment extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = ExperimentResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
