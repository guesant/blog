<?php

namespace App\Filament\Resources\NavItems\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\NavItems\NavItemResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\NavItem getRecord()
 */
class CreateNavItem extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = NavItemResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
