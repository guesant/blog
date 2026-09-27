<?php

namespace App\Filament\Concerns;

use App\Content\Locale;
use App\Events\PublicSiteContentChanged;

trait SyncsRelationTypeTranslations
{
    protected array $pendingRelationTypeTranslations = [];

    protected function extractRelationTypeTranslations(array $data): array
    {
        $this->pendingRelationTypeTranslations = $data['translations'] ?? [];
        unset($data['translations']);

        return $data;
    }

    protected function fillRelationTypeTranslationsIntoData(array $data): array
    {
        $data['translations'] = collect(Locale::all())
            ->mapWithKeys(fn (string $locale): array => [
                $locale => [
                    'outbound_label' => $this->getRecord()->translation($locale)?->outbound_label,
                    'inbound_label' => $this->getRecord()->translation($locale)?->inbound_label,
                ],
            ])
            ->all();

        return $data;
    }

    protected function persistRelationTypeTranslations(): void
    {
        foreach ($this->pendingRelationTypeTranslations as $locale => $translation) {
            if (! is_array($translation)) {
                continue;
            }

            $this->getRecord()->translations()->updateOrCreate(
                ['locale' => Locale::normalize($locale)],
                [
                    'outbound_label' => $translation['outbound_label'] ?? null,
                    'inbound_label' => $translation['inbound_label'] ?? null,
                ],
            );
        }

        PublicSiteContentChanged::dispatch();
    }
}
