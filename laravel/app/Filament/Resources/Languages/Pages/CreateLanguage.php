<?php

namespace App\Filament\Resources\Languages\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Languages\LanguageResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Language getRecord()
 */
class CreateLanguage extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = LanguageResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
