<?php

namespace App\Filament\Resources\Pages\Pages;

use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\Pages\PageResource;
use Filament\Resources\Pages\CreateRecord;

/**
 * @method \App\Models\Page getRecord()
 */
class CreatePage extends CreateRecord
{
    use SyncsTranslations;

    protected static string $resource = PageResource::class;

    protected array $pendingFeaturedCases = [];

    protected array $pendingFeaturedProjects = [];

    protected array $pendingFeaturedWritings = [];

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $this->pendingFeaturedCases = $data['featured_cases'] ?? [];
        $this->pendingFeaturedProjects = $data['featured_projects'] ?? [];
        $this->pendingFeaturedWritings = $data['featured_writings'] ?? [];
        unset($data['featured_cases'], $data['featured_projects'], $data['featured_writings']);

        return $this->extractTranslationsBeforeSave($data);
    }

    protected function afterCreate(): void
    {
        $this->persistTranslations();

        $this->getRecord()->featuredCases()->sync(
            collect($this->pendingFeaturedCases)->mapWithKeys(fn (array $item) => [
                $item['case_study_id'] => ['order' => $item['order'] ?? null],
            ])
        );

        $this->getRecord()->featuredProjects()->sync(
            collect($this->pendingFeaturedProjects)->mapWithKeys(fn (array $item) => [
                $item['project_id'] => ['order' => $item['order'] ?? null],
            ])
        );

        $this->getRecord()->featuredWritings()->sync(
            collect($this->pendingFeaturedWritings)->mapWithKeys(fn (array $item) => [
                $item['writing_id'] => ['order' => $item['order'] ?? null],
            ])
        );
    }
}
