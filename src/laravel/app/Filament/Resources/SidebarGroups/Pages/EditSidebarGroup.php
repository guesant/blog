<?php

namespace App\Filament\Resources\SidebarGroups\Pages;

use App\Events\PublicSiteContentChanged;
use App\Filament\Concerns\SyncsSidebarGroupTranslations;
use App\Filament\Resources\SidebarGroups\SidebarGroupResource;
use App\Models\SidebarGroup;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/** @extends EditRecord<SidebarGroup> */
class EditSidebarGroup extends EditRecord
{
    use SyncsSidebarGroupTranslations;

    protected static string $resource = SidebarGroupResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->fillSidebarGroupTranslationsIntoData($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->extractSidebarGroupTranslations($data);
    }

    protected function afterSave(): void
    {
        $this->persistSidebarGroupTranslations();
    }

    protected function getHeaderActions(): array
    {
        return [DeleteAction::make()->after(function (): void {
            PublicSiteContentChanged::dispatch();
        })];
    }
}
