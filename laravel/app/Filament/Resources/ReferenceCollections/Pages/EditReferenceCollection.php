<?php

namespace App\Filament\Resources\ReferenceCollections\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\ReferenceCollections\ReferenceCollectionResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

/**
 * @method \App\Models\ReferenceCollection getRecord()
 */
class EditReferenceCollection extends EditRecord
{
    use SyncsTranslations;

    protected static string $resource = ReferenceCollectionResource::class;

    protected array $pendingItems = [];

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data = $this->fillTranslationsIntoData($data);

        $data['items'] = $this->getRecord()
            ->resources()
            ->get()
            ->map(fn ($resource) => [
                'resource_id' => $resource->id,
                'note' => $resource->pivot->note,
                'order' => $resource->pivot->order,
            ])
            ->all();

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $this->pendingItems = $data['items'] ?? [];
        unset($data['items']);

        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterSave(): void
    {
        $this->persistTranslations();

        $this->getRecord()->resources()->sync(
            collect($this->pendingItems)->mapWithKeys(fn (array $item) => [
                $item['resource_id'] => ['note' => $item['note'] ?? null, 'order' => $item['order'] ?? null],
            ])
        );
    }
}
