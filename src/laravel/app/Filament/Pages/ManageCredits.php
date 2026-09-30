<?php

namespace App\Filament\Pages;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\ManagesPageContent;
use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Resources\CreditCategories\CreditCategoryResource;
use App\Filament\Resources\CreditEntries\CreditEntryResource;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @extends Page<PageConfiguration>
 *
 * @property-read Schema $form
 */
class ManageCredits extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, ManagesPageContent, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedScale;

    protected static ?string $navigationLabel = 'Manage Credits';

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected static function managedPageSlug(): string
    {
        return 'credits';
    }

    public function mount(): void
    {
        $this->form->fill($this->fillManagedPageData());
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('categories')
                ->label(__('Credit categories'))
                ->url(CreditCategoryResource::getUrl('index')),
            Action::make('entries')
                ->label(__('Credits'))
                ->url(CreditEntryResource::getUrl('index')),
        ];
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                static::pageSettingsSection(),
                static::localizedTabs('translations', fn (string $prefix): array => static::pageTranslationFields($prefix)),
            ])
            ->model($this->getPageRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $this->saveManagedPage($this->form->getState());
        Notification::make()->success()->title(__('Saved'))->send();
    }
}
