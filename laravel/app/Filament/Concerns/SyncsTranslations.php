<?php

namespace App\Filament\Concerns;

/**
 * Glue between the `translations.en.*` / `translations.pt-BR.*` form state
 * built by BuildsTranslationTabs and the model's real `translations()`
 * HasMany relation. Apply to CreateRecord pages (call
 * extractTranslationsBeforeCreate() from mutateFormDataBeforeCreate(), then
 * persistTranslations() from afterCreate()) and to EditRecord pages (call
 * fillTranslationsIntoData() from mutateFormDataBeforeFill(), and the same
 * extract+persist pair from mutateFormDataBeforeSave()/afterSave()).
 */
trait SyncsTranslations
{
    protected array $pendingTranslations = [];

    protected function extractTranslationsBeforeSave(array $data): array
    {
        $this->pendingTranslations = $data['translations'] ?? [];
        unset($data['translations']);

        return $data;
    }

    protected function persistTranslations(): void
    {
        if ($this->pendingTranslations === []) {
            return;
        }

        $translationModel = $this->getRecord()->translations()->getRelated();
        $foreignKey = $this->getRecord()->translations()->getForeignKeyName();

        foreach ($this->pendingTranslations as $locale => $fields) {
            $translationModel::query()->updateOrCreate(
                [$foreignKey => $this->getRecord()->getKey(), 'locale' => $locale],
                $fields,
            );
        }
    }

    protected function fillTranslationsIntoData(array $data): array
    {
        $data['translations'] = $this->getRecord()
            ->translations()
            ->get()
            ->mapWithKeys(fn ($translation) => [
                $translation->locale => $translation->only($translation->getFillable()),
            ])
            ->all();

        return $data;
    }
}
