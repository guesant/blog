<?php

namespace App\Filament\Concerns;

use App\Content\EditorialRevisionPublisher;
use App\Events\PublicSiteContentChanged;
use App\Models\PageRevisionTranslation;
use App\Models\ProfileRevisionTranslation;
use App\Models\ResumeRevisionTranslation;

trait SyncsTranslations
{
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
        if ($this->pendingTranslations === []) {
            PublicSiteContentChanged::dispatch();

            return;
        }

        app(EditorialRevisionPublisher::class)->publish($this->getRecord(), $this->pendingTranslations, $this->pendingRecordData);
    }

    protected function afterDelete(): void
    {
        PublicSiteContentChanged::dispatch();
    }

    protected function fillTranslationsIntoData(array $data): array
    {
        $data['translations'] = collect(['en', 'pt-BR'])
            ->mapWithKeys(fn (string $locale): array => [$locale => $this->translationFields($locale)])
            ->all();

        return $data;
    }

    private function translationFields(string $locale): array
    {
        $translation = $this->getRecord()->translation($locale);
        if ($translation === null) {
            return [];
        }

        if ($translation instanceof PageRevisionTranslation) {
            return $translation->fields;
        }

        if ($translation instanceof ProfileRevisionTranslation) {
            return $this->profileFields($translation);
        }

        if ($translation instanceof ResumeRevisionTranslation) {
            return $this->resumeFields($translation);
        }

        $fields = collect($translation->getAttributes())
            ->except(['id', 'locale', 'created_at', 'updated_at'])
            ->all();
        $fields['seo'] = $translation->seo;
        $fields['metrics'] = $translation->metrics;

        return array_filter($fields, static fn (mixed $value): bool => $value !== null);
    }

    private function profileFields(ProfileRevisionTranslation $translation): array
    {
        return [
            'title' => $translation->title,
            'location' => $translation->location,
            'birth_city' => $translation->birth_city,
            'description' => $translation->description,
            'interests' => $translation->interests,
            'learning' => $translation->learning,
            'personal_interests' => $this->simpleRepeater($translation->personal_interests),
            'fortunes' => $this->simpleRepeater($translation->fortunes),
            'personal_facts' => $this->simpleRepeater($translation->personal_facts),
            'personal_things' => collect($translation->personal_things)
                ->map(fn (array $value): array => ['label' => $value['label'] ?? '', 'since' => $value['since'] ?? ''])
                ->all(),
            'trajectory' => $translation->trajectory,
            'milestones' => $translation->milestones,
        ];
    }

    private function resumeFields(ResumeRevisionTranslation $translation): array
    {
        return [
            'summary' => $translation->summary,
            'leadership' => $translation->leadership,
            'education' => $translation->education,
            'certificates' => $translation->certificates,
            'certifications' => $translation->certifications,
            'publications' => $translation->publications,
            'recommendations' => $translation->recommendations,
            'technical_productions' => $translation->technical_productions,
            'events' => $translation->events,
            'awards' => $translation->awards,
        ];
    }

    private function simpleRepeater(?array $values): array
    {
        return collect($values ?? [])
            ->map(fn (mixed $value): string => match (true) {
                is_array($value) => (string) ($value['value'] ?? ''),
                is_scalar($value) => (string) $value,
                default => '',
            })
            ->all();
    }
}
