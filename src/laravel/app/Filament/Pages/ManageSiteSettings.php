<?php

namespace App\Filament\Pages;

use App\Content\PublicSiteChromeCache;
use App\Filament\Concerns\BuildsStructuredFields;
use App\Filament\Concerns\BuildsTranslationTabs;
use App\Filament\Concerns\HasSingleSaveAction;
use App\Filament\Concerns\SyncsTranslations;
use App\Filament\Support\AutocompleteField;
use App\Filament\Support\FilamentOptionCatalog;
use App\Models\ContactProfile;
use App\Models\ResourceLink;
use App\Models\SiteSettings;
use BackedEnum;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
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
    use BuildsStructuredFields, BuildsTranslationTabs, HasSingleSaveAction, SyncsTranslations;

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
        $platforms = [
            ...array_keys(FilamentOptionCatalog::PLATFORMS),
            ...ContactProfile::query()->distinct()->pluck('platform')->all(),
            ...ResourceLink::query()->distinct()->pluck('platform')->all(),
        ];

        return $schema
            ->components([
                Section::make('Site settings')
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
                        TextInput::make('contact_email')
                            ->email()
                            ->nullable()
                            ->maxLength(255),
                        Toggle::make('contact_enabled')
                            ->label('Show Contact')
                            ->helperText('Controls whether the public contact section and links are shown.')
                            ->default(true),
                        Toggle::make('contact_available')
                            ->label('Available for Opportunities')
                            ->helperText('Controls only the public availability indicator.')
                            ->default(false),
                        TextInput::make('source_repository_url')
                            ->label('URL do repositório')
                            ->helperText('Deixe em branco para ocultar os links de fork/issue e a URL do repositório no rodapé do site.')
                            ->url()
                            ->nullable()
                            ->maxLength(255),
                    ]),
                Section::make('Public feature flags')
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
                Section::make('Contact Profiles')
                    ->schema([
                        Repeater::make('contactProfiles')
                            ->relationship('contactProfiles')
                            ->orderColumn('order')
                            ->reorderableWithButtons()
                            ->columns(2)
                            ->schema([
                                AutocompleteField::make(
                                    'platform',
                                    'Platform',
                                    $platforms,
                                    true,
                                ),
                                TextInput::make('label')->nullable(),
                                TextInput::make('url')->required()->url()->columnSpanFull(),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['platform'] ?? null)
                            ->addActionLabel('Add contact profile')
                            ->defaultItems(0),
                    ]),
                static::translationTabs(fn (string $prefix) => [
                    Fieldset::make('Maintenance messages')
                        ->columns(2)
                        ->schema([
                            TextInput::make("{$prefix}maintenance_eyebrow")
                                ->label('Maintenance Eyebrow')
                                ->nullable()
                                ->maxLength(255),
                            TextInput::make("{$prefix}maintenance_title")
                                ->label('Maintenance Title')
                                ->nullable()
                                ->maxLength(255),
                            Textarea::make("{$prefix}maintenance_description")
                                ->label('Maintenance Description')
                                ->nullable()
                                ->columnSpanFull(),
                        ]),
                    Fieldset::make('Copyright')
                        ->schema([
                            Textarea::make("{$prefix}copyright_template")
                                ->label('Copyright Template')
                                ->nullable()
                                ->helperText('Use {year} and {name} as placeholders.'),
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
        unset($data['contactProfiles']);

        $data = $this->extractTranslationsBeforeSave($data);

        $this->getRecord()->update($data);
        $this->persistTranslations();
        app(PublicSiteChromeCache::class)->forgetAll();

        Notification::make()->success()->title('Saved')->send();
    }
}
