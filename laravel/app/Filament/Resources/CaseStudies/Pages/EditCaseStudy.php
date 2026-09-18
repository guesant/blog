<?php

namespace App\Filament\Resources\CaseStudies\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\CaseStudies\CaseStudyResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\CaseStudy getRecord()
 */
class EditCaseStudy extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = CaseStudyResource::class;

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
