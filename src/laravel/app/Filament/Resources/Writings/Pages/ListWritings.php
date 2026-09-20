<?php

namespace App\Filament\Resources\Writings\Pages;

use App\Filament\Resources\Writings\WritingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListWritings extends ListRecords
{
    protected static string $resource = WritingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
