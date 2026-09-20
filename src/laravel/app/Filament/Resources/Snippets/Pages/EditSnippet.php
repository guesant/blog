<?php

namespace App\Filament\Resources\Snippets\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Snippets\SnippetResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\Snippet getRecord()
 */
class EditSnippet extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = SnippetResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->fillTranslationsIntoData($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterSave(): void
    {
        $this->persistTranslations();
    }
}
