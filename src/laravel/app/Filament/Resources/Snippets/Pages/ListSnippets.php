<?php

namespace App\Filament\Resources\Snippets\Pages;

use App\Filament\Resources\Snippets\SnippetResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSnippets extends ListRecords
{
    protected static string $resource = SnippetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
