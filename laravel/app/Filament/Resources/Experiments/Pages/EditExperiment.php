<?php

namespace App\Filament\Resources\Experiments\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Experiments\ExperimentResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\Experiment getRecord()
 */
class EditExperiment extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = ExperimentResource::class;

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
