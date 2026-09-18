<?php

namespace App\Filament\Resources\Topics\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Topics\TopicResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\Topic getRecord()
 */
class EditTopic extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = TopicResource::class;

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
