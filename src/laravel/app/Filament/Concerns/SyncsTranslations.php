<?php

namespace App\Filament\Concerns;

use App\Content\EditorialRevisionPublisher;
use App\Events\PublicSiteContentChanged;
use Illuminate\Database\Eloquent\Model;

trait SyncsTranslations
{
    use LoadsTranslationData;

    protected array $pendingTranslations = [];

    protected array $pendingRecordData = [];

    protected function extractTranslationsBeforeSave(array $data): array
    {
        $this->pendingRecordData = $data;
        $this->pendingTranslations = $data['translations'] ?? [];
        unset($data['translations']);
        unset($data['authors'], $data['organizations'], $data['type_details']);

        return $data;
    }

    protected function persistTranslations(): void
    {
        app(EditorialRevisionPublisher::class)->publish($this->getRecord(), $this->pendingTranslations, $this->pendingRecordData);
    }

    protected function publishTranslationsFor(Model $record, array $translations, array $recordData = []): void
    {
        app(EditorialRevisionPublisher::class)->publish($record, $translations, $recordData);
    }

    protected function afterDelete(): void
    {
        PublicSiteContentChanged::dispatch();
    }
}
