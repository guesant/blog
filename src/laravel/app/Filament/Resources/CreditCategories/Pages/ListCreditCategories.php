<?php

namespace App\Filament\Resources\CreditCategories\Pages;

use App\Filament\Resources\CreditCategories\CreditCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCreditCategories extends ListRecords
{
    protected static string $resource = CreditCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [CreateAction::make()];
    }
}
