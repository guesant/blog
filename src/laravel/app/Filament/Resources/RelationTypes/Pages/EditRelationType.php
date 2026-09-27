<?php

namespace App\Filament\Resources\RelationTypes\Pages;

use App\Filament\Concerns\SyncsRelationTypeTranslations;
use App\Filament\Resources\RelationTypes\RelationTypeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditRelationType extends EditRecord
{
    use SyncsRelationTypeTranslations;

    protected static string $resource = RelationTypeResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        return $this->fillRelationTypeTranslationsIntoData($data);
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return $this->extractRelationTypeTranslations($data);
    }

    protected function afterSave(): void
    {
        $this->persistRelationTypeTranslations();
    }

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
