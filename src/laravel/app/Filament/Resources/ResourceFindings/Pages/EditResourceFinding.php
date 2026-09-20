<?php

namespace App\Filament\Resources\ResourceFindings\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\ResourceFindings\ResourceFindingResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\Resource getRecord()
 */
class EditResourceFinding extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = ResourceFindingResource::class;

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
