<?php

namespace App\Filament\Resources\SidebarGroups\Pages;

use App\Filament\Resources\SidebarGroups\SidebarGroupResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSidebarGroups extends ListRecords
{
    protected static string $resource = SidebarGroupResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}
