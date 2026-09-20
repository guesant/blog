<?php

namespace App\Filament\Resources\ResourceFindings\Pages;

use App\Filament\Resources\ResourceFindings\ResourceFindingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListResourceFindings extends ListRecords
{
    protected static string $resource = ResourceFindingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
