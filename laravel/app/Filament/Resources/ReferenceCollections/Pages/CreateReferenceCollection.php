<?php

namespace App\Filament\Resources\ReferenceCollections\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\ReferenceCollections\ReferenceCollectionResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\ReferenceCollection getRecord()
 */
class CreateReferenceCollection extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = ReferenceCollectionResource::class;

    protected array $pendingItems = [];

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->pendingItems = $data['items'] ?? [];
        unset($data['items']);

        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();

        $this->getRecord()->resources()->sync(
            collect($this->pendingItems)->mapWithKeys(fn (array $item) => [
                $item['resource_id'] => ['note' => $item['note'] ?? null, 'order' => $item['order'] ?? null],
            ])
        );
    }
}
