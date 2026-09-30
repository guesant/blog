<?php

namespace App\Filament\Concerns;

use App\Events\PublicSiteContentChanged;
use App\Models\SidebarGroup;
use LogicException;

trait SyncsSidebarGroupTranslations
{
    protected array $pendingTranslations = [];

    protected function extractSidebarGroupTranslations(array $data): array
    {
        $this->pendingTranslations = $data['translations'] ?? [];
        unset($data['translations']);

        return $data;
    }

    protected function fillSidebarGroupTranslationsIntoData(array $data): array
    {
        $data['translations'] = collect(['en', 'pt-BR'])
            ->mapWithKeys(fn (string $locale): array => [
                $locale => ['label' => $this->sidebarGroup()->translation($locale)?->label],
            ])
            ->all();

        return $data;
    }

    protected function persistSidebarGroupTranslations(): void
    {
        foreach ($this->pendingTranslations as $locale => $translation) {
            $this->sidebarGroup()->translations()->updateOrCreate(
                ['locale' => $locale],
                ['label' => $translation['label'] ?? ''],
            );
        }

        PublicSiteContentChanged::dispatch();
    }

    private function sidebarGroup(): SidebarGroup
    {
        $record = $this->getRecord();

        if (! $record instanceof SidebarGroup) {
            throw new LogicException('The sidebar group translation synchronizer requires a SidebarGroup record.');
        }

        return $record;
    }
}
