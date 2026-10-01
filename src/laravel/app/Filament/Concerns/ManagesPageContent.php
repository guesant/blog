<?php

namespace App\Filament\Concerns;

use App\Content\EditorialRevisionPublisher;
use App\Models\Page as ContentPage;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;

trait ManagesPageContent
{
    protected ?ContentPage $pageRecord = null;

    abstract protected static function managedPageSlug(): string;

    protected function getPageRecord(): ContentPage
    {
        return $this->pageRecord ??= ContentPage::query()->firstOrCreate([
            'slug' => static::managedPageSlug(),
        ]);
    }

    protected function getRecord(): ContentPage
    {
        return $this->getPageRecord();
    }

    protected function fillManagedPageData(): array
    {
        return $this->fillTranslationsIntoData($this->getPageRecord()->attributesToArray());
    }

    protected function saveManagedPage(array $data): void
    {
        $data = $this->extractTranslationsBeforeSave($data);
        $this->getPageRecord()->update($data);
        $this->persistTranslations();
    }

    protected static function pageSettingsSection(): Section
    {
        return Section::make(__('Page settings'))
            ->schema([
                Toggle::make('hidden')
                    ->label(__('Hide from public site'))
                    ->default(false),
            ]);
    }

    protected static function pageTranslationFields(string $prefix): array
    {
        return [
            TextInput::make("{$prefix}fields.title")
                ->label(__('Title'))
                ->nullable(),
            static::markdownEditor("{$prefix}fields.description")
                ->label(__('Description'))
                ->nullable(),
        ];
    }

    protected function syncFeaturedPageContent(array $data): void
    {
        $page = $this->getPageRecord();
        foreach ([
            'featured_cases' => ['relation' => 'featuredCases', 'key' => 'case_study_id'],
            'featured_projects' => ['relation' => 'featuredProjects', 'key' => 'project_id'],
            'featured_writings' => ['relation' => 'featuredWritings', 'key' => 'writing_id'],
        ] as $field => $definition) {
            $page->{$definition['relation']}()->sync(
                collect($data[$field] ?? [])->values()->mapWithKeys(
                    fn (array $item, int $order): array => [
                        $item[$definition['key']] => ['order' => $order],
                    ],
                ),
            );
        }

        app(EditorialRevisionPublisher::class)->syncPageRelations($page);
    }
}
