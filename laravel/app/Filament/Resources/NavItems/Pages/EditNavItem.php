<?php

namespace App\Filament\Resources\NavItems\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\NavItems\NavItemResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\NavItem getRecord()
 */
class EditNavItem extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = NavItemResource::class;

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
