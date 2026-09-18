<?php

namespace App\Filament\Resources\Snippets\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Snippets\SnippetResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Snippet getRecord()
 */
class CreateSnippet extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = SnippetResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();
    }
}
