<?php

namespace App\Filament\Resources\Topics\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Topics\TopicResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Topic getRecord()
 */
class CreateTopic extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = TopicResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
