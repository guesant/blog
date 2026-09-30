<?php

namespace App\Filament\Pages;

use App\Content\PublicSiteChromeCache;
use App\Filament\Concerns\BuildsMarkdownEditors;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\SyncsTranslations;
use App\Models\SiteSettings;
use BackedEnum;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Fieldset;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;

/**
 * @property-read Schema $form
 */
class ManageSiteSettings extends Page
{
    use BuildsMarkdownEditors, BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, SyncsTranslations;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected string $view = 'filament-panels::pages.page';

    public ?array $data = [];

    protected ?SiteSettings $record = null;

    public function mount(): void
    {
        $this->record = SiteSettings::query()->first() ?? SiteSettings::create([]);

        $data = $this->record->attributesToArray();
        $data = $this->fillTranslationsIntoData($data);

        $this->form->fill($data);
    }

    protected function getRecord(): SiteSettings
    {
        return $this->record ??= SiteSettings::query()->first() ?? SiteSettings::create([]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make(__('Site settings'))
                    ->columns(2)
                    ->schema([
                        TextInput::make('short_name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('portfolio_url')
                            ->required()
                            ->url()
                            ->maxLength(255),
                        Toggle::make('maintenance_enabled')
                            ->default(false),
                        TextInput::make('source_repository_url')
                            ->label('Repository URL')
                            ->helperText(__('Leave blank to hide the fork/issue links and the repository URL in the site footer.'))
                            ->url()
                            ->nullable()
                            ->maxLength(255),
                    ]),
                Section::make(__('Public feature flags'))
                    ->columns(2)
                    ->schema([
                        Toggle::make('content_actions_copy_text')
                            ->label('Show Copy Text')
                            ->default(false),
                        Toggle::make('content_actions_copy_url')
                            ->label('Show Copy Link')
                            ->default(false),
                        Toggle::make('content_actions_download_text')
                            ->label('Show Download Text')
                            ->default(false),
                        Toggle::make('contextual_cursor_enabled')
                            ->label('Enable Contextual Cursor')
                            ->default(false),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    Fieldset::make(__('Maintenance messages'))
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}maintenance_title")
                                ->label('Maintenance Title')
                                ->nullable()
                                ->maxLength(255),
                            static::markdownEditor("{$prefix}maintenance_description")
                                ->label('Maintenance Description')
                                ->nullable(),
                        ]),
                    Fieldset::make(__('Copyright'))
                        ->schema([
                            static::markdownEditor("{$prefix}copyright_template")
                                ->label('Copyright Template')
                                ->nullable()
                                ->helperText(__('Use {year} and {name} as placeholders.')),
                        ]),
                    static::seoFieldset($prefix),
                ]),
            ])
            ->model($this->getRecord())
            ->statePath('data');
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $data = $this->extractTranslationsBeforeSave($data);

        $this->getRecord()->update($data);
        $this->persistTranslations();
        app(PublicSiteChromeCache::class)->forgetAll();

        Notification::make()->success()->title(__('Saved'))->send();
    }
}
