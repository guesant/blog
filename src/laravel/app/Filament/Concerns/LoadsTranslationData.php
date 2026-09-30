<?php

namespace App\Filament\Concerns;

use App\Models\Page;
use App\Models\PageRevisionTranslation;
use App\Models\ProfileRevisionTranslation;
use App\Models\ResumeRevisionTranslation;
use App\Models\RevisionTranslation;
use App\Models\SiteSettings;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait LoadsTranslationData
{
    protected function fillTranslationsIntoData(array $data): array
    {
        if ($this->getRecord()->getTable() === 'nav_items') {
            return $data;
        }

        $data['translations'] = collect(['en', 'pt-BR'])
            ->mapWithKeys(function (string $locale): array {
                $fields = $this->translationFields($locale);

                if ($this->getRecord()->getTable() === 'pages') {
                    return [$locale => [
                        'fields' => collect($fields)
                            ->except('seo')
                            ->mapWithKeys(fn (mixed $value, string $key): array => [Str::snake($key) => $value])
                            ->all(),
                        'seo' => $fields['seo'] ?? null,
                    ]];
                }

                return [$locale => $fields];
            })
            ->all();

        return $data;
    }

    protected function fillTranslationsForRecord(Page|SiteSettings $record, array $data): array
    {
        $data['translations'] = collect(['en', 'pt-BR'])
            ->mapWithKeys(function (string $locale) use ($record): array {
                $fields = $this->translationFieldsForRecord($record, $locale);

                if ($record instanceof Page) {
                    return [$locale => [
                        'fields' => collect($fields)
                            ->except('seo')
                            ->mapWithKeys(fn (mixed $value, string $key): array => [Str::snake($key) => $value])
                            ->all(),
                        'seo' => $fields['seo'] ?? null,
                    ]];
                }

                return [$locale => $fields];
            })
            ->all();

        return $data;
    }

    private function translationFieldsForRecord(Page|SiteSettings $record, string $locale): array
    {
        $translation = $record->translation($locale);
        if ($translation === null) {
            return [];
        }

        if ($translation instanceof PageRevisionTranslation) {
            $fields = $translation->fields;
            $fields['seo'] = $translation->seo;

            return $fields;
        }

        $fields = collect($translation->getAttributes())
            ->except(['id', 'locale', 'created_at', 'updated_at'])
            ->all();
        $fields['seo'] = $translation->seo;
        $fields['metrics'] = $translation->metrics;

        return array_filter($fields, static fn (mixed $value): bool => $value !== null);
    }

    private function translationFields(string $locale): array
    {
        /** @var Model|null $translation */
        $translation = $this->getRecord()->translation($locale);
        if ($translation === null) {
            return [];
        }

        if ($translation instanceof PageRevisionTranslation) {
            $fields = $translation->fields;
            $fields['seo'] = $translation->seo;

            return $fields;
        }

        if ($translation instanceof ProfileRevisionTranslation) {
            return $this->profileFields($translation);
        }

        if ($translation instanceof ResumeRevisionTranslation) {
            return $this->resumeFields($translation);
        }

        if (! $translation instanceof RevisionTranslation) {
            return [];
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
        $attributes = $translation->getAttributes();

        return [
            'title' => $attributes['title'] ?? null,
            'location' => $attributes['location'] ?? null,
            'birth_city' => $attributes['birth_city'] ?? null,
            'description' => $attributes['description'] ?? null,
            'interests' => $attributes['interests'] ?? null,
            'learning' => $attributes['learning'] ?? null,
            'personal_interests' => $this->simpleRepeater($attributes['personal_interests'] ?? null),
            'fortunes' => $this->simpleRepeater($attributes['fortunes'] ?? null),
            'personal_facts' => $this->simpleRepeater($attributes['personal_facts'] ?? null),
            'personal_things' => collect($attributes['personal_things'] ?? [])
                ->map(fn (array $value): array => ['label' => $value['label'] ?? '', 'since' => $value['since'] ?? ''])
                ->all(),
            'trajectory' => $attributes['trajectory'] ?? null,
            'milestones' => $attributes['milestones'] ?? null,
        ];
    }

    private function resumeFields(ResumeRevisionTranslation $translation): array
    {
        $attributes = $translation->getAttributes();

        return [
            'summary' => $attributes['summary'] ?? null,
            'leadership' => $attributes['leadership'] ?? null,
            'education' => $attributes['education'] ?? null,
            'certificates' => $attributes['certificates'] ?? null,
            'certifications' => $attributes['certifications'] ?? null,
            'publications' => $attributes['publications'] ?? null,
            'recommendations' => $attributes['recommendations'] ?? null,
            'technical_productions' => $attributes['technical_productions'] ?? null,
            'events' => $attributes['events'] ?? null,
            'awards' => $attributes['awards'] ?? null,
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
