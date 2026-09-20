<?php

namespace App\Filament\Resources\CaseStudies\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\CaseStudies\CaseStudyResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\CaseStudy getRecord()
 */
class CreateCaseStudy extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = CaseStudyResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
