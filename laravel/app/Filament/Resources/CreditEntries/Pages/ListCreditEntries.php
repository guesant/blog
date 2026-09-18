<?php

namespace App\Filament\Resources\CreditEntries\Pages;

use App\Filament\Resources\CreditEntries\CreditEntryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCreditEntries extends ListRecords
{
    protected static string $resource = CreditEntryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
