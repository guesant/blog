<?php

namespace App\Filament\Resources\SidebarGroups\Pages;

use App\Filament\Concerns\SyncsSidebarGroupTranslations;
use App\Filament\Resources\SidebarGroups\SidebarGroupResource;
use App\Models\SidebarGroup;
use Filament\Resources\Pages\CreateRecord;

/** @extends CreateRecord<SidebarGroup> */
class CreateSidebarGroup extends CreateRecord
{
    use SyncsSidebarGroupTranslations;

    protected static string $resource = SidebarGroupResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractSidebarGroupTranslations($data);
    }

    protected function afterCreate(): void
    {
        $this->persistSidebarGroupTranslations();
    }
}
