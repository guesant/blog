<?php

namespace App\Filament\Pages;

use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\ManagesPageContent;
use App\Filament\Concerns\SyncsTranslations;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Pages\PageConfiguration;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @extends Page<PageConfiguration>
 *
 * @property-read Schema $form
 */
class ManageFollow extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, ManagesPageContent, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRss;

    protected static ?string $navigationLabel = 'Manage Follow';

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected static function managedPageSlug(): string
    {
        return 'follow';
    }

    public function mount(): void
    {
        $this->form->fill($this->fillManagedPageData());
    }

    public function form(Schema $schema): Schema
    {
        $feedKeys = [
            'activitypub',
            'api',
            'atom',
            'jsonfeed',
            'robots',
            'rss',
            'sitemap',
            'webfinger',
            'webmention',
            'websub',
        ];

        return $schema
            ->components([
                static::pageSettingsSection(),
                static::localizedTabs('translations', function (string $prefix) use ($feedKeys): array {
                    $feedFields = [];
                    foreach ($feedKeys as $key) {
                        $feedFields[] = TextInput::make("{$prefix}fields.{$key}_title")
                            ->label(__(str($key)->headline().' title'))
                            ->nullable();
                        $feedFields[] = static::markdownEditor("{$prefix}fields.{$key}_description")
                            ->label(__(str($key)->headline().' description'))
                            ->nullable();
                    }

                    return [
                        ...static::pageTranslationFields($prefix),
                        Fieldset::make(__('Current'))
                            ->columns(2)
                            ->schema([
                                static::markdownEditor("{$prefix}fields.intro")->label(__('Introduction'))->nullable(),
                                TextInput::make("{$prefix}fields.section_label")->label(__('Section label'))->nullable(),
                                TextInput::make("{$prefix}fields.section_title")->label(__('Section title'))->nullable(),
                            ]),
                        Fieldset::make(__('Future'))
                            ->columns(2)
                            ->schema([
                                TextInput::make("{$prefix}fields.future_label")->label(__('Future label'))->nullable(),
                                TextInput::make("{$prefix}fields.future_title")->label(__('Future title'))->nullable(),
                                TextInput::make("{$prefix}fields.planned_label")->label(__('Planned label'))->nullable(),
                                TextInput::make("{$prefix}fields.planned_title")->label(__('Planned title'))->nullable(),
                            ]),
                        Fieldset::make(__('Feeds'))
                            ->columns(2)
                            ->schema($feedFields),
                    ];
                }),
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
