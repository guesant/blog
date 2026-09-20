<?php

namespace App\Filament\Resources\Technologies\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Technologies\TechnologyResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\Technology getRecord()
 */
class EditTechnology extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = TechnologyResource::class;

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
