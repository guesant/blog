<?php

namespace App\Filament\Concerns;

use App\Content\Locale;
use App\Events\PublicSiteContentChanged;

trait SyncsCreditCategoryTranslations
{
    protected array $pendingCreditCategoryTranslations = [];

    protected function extractCreditCategoryTranslations(array $data): array
    {
        $this->pendingCreditCategoryTranslations = $data['translations'] ?? [];
        unset($data['translations']);

        return $data;
    }

    protected function fillCreditCategoryTranslationsIntoData(array $data): array
    {
        $data['translations'] = collect(Locale::all())
            ->mapWithKeys(fn (string $locale): array => [
                $locale => ['name' => $this->getRecord()->translation($locale)?->name],
            ])
            ->all();

        return $data;
    }

    protected function persistCreditCategoryTranslations(): void
    {
        foreach ($this->pendingCreditCategoryTranslations as $locale => $translation) {
            if (! is_array($translation)) {
                continue;
            }

            $this->getRecord()->translations()->updateOrCreate(
                ['locale' => Locale::normalize($locale)],
                ['name' => $translation['name'] ?? null],
            );
        }

        PublicSiteContentChanged::dispatch();
    }
}
